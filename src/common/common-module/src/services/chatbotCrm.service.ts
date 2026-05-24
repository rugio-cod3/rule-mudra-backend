import { BadRequestError, NotFoundError } from '@/errors'
import { IServiceResponse } from '@/interfaces/service.interface'
import ResponseService from '@/services/response.service'
import S3Service from '@/services/thirdParty/s3.service'
import { HttpStatusCode } from 'axios'
import { chatbotCustomerQueryModel } from '../database/mysql/chatbotCustomerQuery'
import { chatbotStageModel } from '../database/mysql/chatbotStage'
import { chatbotStageContentModel } from '../database/mysql/chatbotStageContent'
import { ChatbotContentType, ChatbotQueryStatus } from '../enums/chatbot.enum'
import {
  IChatbotCustomerQuery,
  IChatbotStageContent,
  IContentCreationResponse,
  IContentDeletionResponse,
  ICreateContentPayload,
  ICreateQueryPayload,
  ICreateQueryResponse,
  ICreateStagePayload,
  IGetContentQuery,
  IGetContentResponse,
  IGetQueriesQuery,
  IGetQueriesResponse,
  IGetStagesResponse,
  IQueryDetailsResponse,
  IStageOperationResponse,
  IUpdateContentPayload,
  IUpdateQueryStatusPayload,
  IUpdateStagePayload,
} from '../interfaces/chatbot.interface'
import { ICustomer } from '../interfaces/customer.interface'
import { calculateTotalPages } from '../utils/util'

export class ChatbotCrmService extends ResponseService {
  private readonly chatbotStageModel = chatbotStageModel
  private readonly chatbotStageContentModel = chatbotStageContentModel
  private readonly chatbotCustomerQueryModel = chatbotCustomerQueryModel
  private readonly s3Service = new S3Service()

  constructor() {
    super()
  }

  // Stage Management APIs
  async getStages(pagination: { page: number; perPage: number }): Promise<IServiceResponse> {
    try {
      // Get total count of all stages (without pagination)
      const totalItems = await this.chatbotStageModel.count({})

      // Error - not found
      if (totalItems === 0) {
        throw new NotFoundError('No stages found')
      }

      // Get paginated stages
      const stages = await this.chatbotStageModel.find({
        order: [{ column: 'id', order: 'asc' }],
        paginate: pagination,
      })

      const response: IGetStagesResponse = {
        data: stages,
        pagination: {
          current_page: Math.floor(pagination.page / pagination.perPage) + 1,
          total_pages: calculateTotalPages(totalItems, pagination.perPage),
          total_items: totalItems,
          per_page: pagination.perPage,
        },
      }

      return this.serviceResponse(200, response, 'Stages retrieved successfully')
    } catch (error) {
      throw error
    }
  }

  async createStage(payload: ICreateStagePayload): Promise<IServiceResponse> {
    try {
      // Check if stage key already exists
      const existingStage = await this.chatbotStageModel.findOne({
        where: { stage_key: payload.stage_key },
      })

      if (existingStage) {
        throw new BadRequestError(`Stage with key '${payload.stage_key}' already exists`)
      }

      // Create new stage
      const newStage = await this.chatbotStageModel.create(payload)

      // Get the created stage with full details
      const createdStage = await this.chatbotStageModel.findOne({
        where: { id: newStage[0] },
      })

      const response: IStageOperationResponse = {
        data: createdStage,
      }

      return this.serviceResponse(201, response, 'Stage created successfully')
    } catch (error) {
      throw error
    }
  }

  async updateStage(
    id: number,
    payload: Omit<IUpdateStagePayload, 'id'>,
  ): Promise<IServiceResponse> {
    try {
      // Check if stage exists
      const existingStage = await this.chatbotStageModel.findOne({
        where: { id },
      })

      if (!existingStage) {
        throw new NotFoundError(`Stage with id ${id} not found`)
      }

      // Check if the new stage key already exists (and is not the current stage)
      if (payload?.stage_key && payload.stage_key !== existingStage.stage_key) {
        const duplicateKey = await this.chatbotStageModel.findOne({
          where: { stage_key: payload.stage_key },
        })

        if (duplicateKey) {
          throw new BadRequestError(`Stage with key '${payload.stage_key}' already exists`)
        }
      }

      // Update stage
      await this.chatbotStageModel.update(
        {
          id,
        },
        {
          stage_key: payload?.stage_key || existingStage.stage_key,
          stage_name: payload?.stage_name || existingStage.stage_name,
        },
      )

      // Get updated stage
      const updatedStage = await this.chatbotStageModel.findOne({ where: { id } })

      const response: IStageOperationResponse = {
        data: updatedStage,
      }

      return this.serviceResponse(200, response, 'Stage updated successfully')
    } catch (error) {
      throw error
    }
  }

  async deleteStage(id: number): Promise<IServiceResponse> {
    try {
      // Check if stage exists
      const existingStage = await this.chatbotStageModel.findOne({
        where: { id },
      })

      if (!existingStage) {
        throw new NotFoundError(`Stage with id ${id} not found`)
      }

      // Check if stage has associated content
      const contentCount = await this.chatbotStageContentModel.count({
        where: { stage_id: id },
      })

      if (contentCount > 0) {
        throw new BadRequestError(
          `Cannot delete stage with ${contentCount} associated content item(s). Delete the content first.`,
        )
      }

      // Delete stage
      await this.chatbotStageModel.delete({ id })

      return this.serviceResponse(200, { success: true }, 'Stage deleted successfully')
    } catch (error) {
      throw error
    }
  }

  // Content Management APIs
  async getContent(
    query: IGetContentQuery,
    pagination: { page: number; perPage: number },
  ): Promise<IServiceResponse> {
    try {
      const { stage_id, content_type, is_active } = query

      // Verify stage exists
      const stage = await this.chatbotStageModel.findOne({
        where: { id: stage_id },
      })

      if (!stage) {
        throw new NotFoundError('Stage not found')
      }

      // Build where conditions
      const whereConditions: any = { stage_id }

      if (content_type) {
        whereConditions.content_type = content_type
      }

      if (is_active !== undefined) {
        whereConditions.is_active = is_active
      }

      // Get content with stage information
      const content = await this.chatbotStageContentModel.findWithStage({
        where: whereConditions,
        paginate: pagination,
        order: [
          { column: 'chatbot_stage_content.id', order: 'asc' },
          { column: 'chatbot_stage_content.content_type', order: 'asc' }, // Nudges first
        ],
      })

      // Get content statistics
      const totalContent = await this.chatbotStageContentModel.count({
        where: { stage_id },
      })

      const activeContent = await this.chatbotStageContentModel.count({
        where: { stage_id, is_active: true },
      })

      const response: IGetContentResponse = {
        data: content,
        meta: {
          stage_name: stage.stage_name,
          total_content: totalContent,
          active_content: activeContent,
        },
      }

      return this.serviceResponse(200, response, 'Content retrieved successfully')
    } catch (error) {
      throw error
    }
  }

  async createContent(payload: ICreateContentPayload): Promise<IServiceResponse> {
    try {
      const { stage_id, content_type, question_text, answer_text, is_active = true } = payload

      // Verify stage exists
      const stage = await this.chatbotStageModel.findOne({
        where: { id: stage_id },
      })

      if (!stage) {
        throw new NotFoundError('Stage not found')
      }

      // Validate content based on type
      if (
        content_type === ChatbotContentType.FAQ &&
        (!question_text || question_text.trim() === '')
      ) {
        throw new BadRequestError('Question text is required for FAQ content type')
      }

      if (content_type === ChatbotContentType.NUDGE && question_text) {
        throw new BadRequestError('Question text should be null for Nudge content type')
      }

      // Validate answer text
      if (!answer_text || answer_text.trim().length < 10) {
        throw new BadRequestError('Answer text must be at least 10 characters long')
      }

      if (answer_text.length > 2000) {
        throw new BadRequestError('Answer text cannot exceed 2000 characters')
      }

      // Create content
      const contentData: Partial<IChatbotStageContent> = {
        stage_id,
        content_type,
        question_text: content_type === ChatbotContentType.FAQ ? question_text : null,
        answer_text: answer_text.trim(),
        is_active,
        created_at: new Date(),
        updated_at: new Date(),
      }

      const [contentId] = await this.chatbotStageContentModel.create(contentData)

      // Retrieve the created content
      const createdContent = await this.chatbotStageContentModel.findOne({
        where: { id: contentId },
      })

      const response: IContentCreationResponse = {
        data: createdContent!,
      }

      return this.serviceResponse(201, response, 'Content created successfully')
    } catch (error) {
      throw error
    }
  }

  async updateContent(id: number, payload: IUpdateContentPayload): Promise<IServiceResponse> {
    try {
      const { stage_id, content_type, question_text, answer_text, is_active = true } = payload

      // Check if content exists
      const existingContent = await this.chatbotStageContentModel.findOne({
        where: { id },
      })

      if (!existingContent) {
        throw new NotFoundError('Content not found')
      }

      // Verify stage exists
      const stage = await this.chatbotStageModel.findOne({
        where: { id: stage_id },
      })

      if (!stage) {
        throw new NotFoundError('Stage not found')
      }

      // Validate that content_type cannot be changed
      if (existingContent.content_type !== content_type) {
        throw new BadRequestError('Content type cannot be changed after creation')
      }

      // Validate content based on type
      if (
        content_type === ChatbotContentType.FAQ &&
        (!question_text || question_text.trim() === '')
      ) {
        throw new BadRequestError('Question text is required for FAQ content type')
      }

      if (content_type === ChatbotContentType.NUDGE && question_text) {
        throw new BadRequestError('Question text should be null for Nudge content type')
      }

      // Update content
      const updateData: Partial<IChatbotStageContent> = {
        stage_id,
        question_text: content_type === ChatbotContentType.FAQ ? question_text : null,
        answer_text: answer_text.trim(),
        is_active,
        updated_at: new Date(),
      }

      await this.chatbotStageContentModel.update({ id }, updateData)

      // Retrieve the updated content
      const updatedContent = await this.chatbotStageContentModel.findOne({
        where: { id },
      })

      const response: IContentCreationResponse = {
        data: updatedContent!,
      }

      return this.serviceResponse(200, response, 'Content updated successfully')
    } catch (error) {
      throw error
    }
  }

  async deleteContent(id: number, hardDelete: boolean = false): Promise<IServiceResponse> {
    try {
      // Check if content exists
      const existingContent = await this.chatbotStageContentModel.findOne({
        where: { id },
      })

      if (!existingContent) {
        throw new NotFoundError('Content not found')
      }

      if (hardDelete) {
        // Permanent deletion
        await this.chatbotStageContentModel.delete({ id })
      } else {
        // Soft delete (set is_active to false)
        await this.chatbotStageContentModel.softDelete({ id })
      }

      const response: IContentDeletionResponse = {
        message: hardDelete ? 'Content deleted permanently' : 'Content deactivated successfully',
        deleted_id: id,
      }

      return this.serviceResponse(200, response, response.message)
    } catch (error) {
      throw error
    }
  }

  // Query Management APIs
  async getQueries(
    customer: Partial<ICustomer> | null,
    query: IGetQueriesQuery,
    pagination: { page: number; perPage: number },
  ): Promise<IServiceResponse> {
    try {
      const { status, category, startDate, endDate, search, sort = 'id', order = 'desc' } = query

      // Build where conditions
      const whereConditions: any = {}
      if (status) whereConditions.status = status
      if (category) whereConditions.query_category = category

      // Build date range
      const dateRange: any = {}
      if (startDate) dateRange.startDate = startDate
      if (endDate) dateRange.endDate = endDate

      let queries: IQueryDetailsResponse[] = []
      let totalItems: number = 0

      // If customer exists in request (authenticated customer), filter by their customerID
      if (customer?.customerID) {
        // Add customer_id to where conditions
        whereConditions.customer_id = customer.customerID

        const [rawQueries, totalItems] = await Promise.all([
          // Get queries with filters but without joining the customer table
          this.chatbotCustomerQueryModel.findWithFilters({
            where: whereConditions,
            search,
            dateRange,
            order: [{ column: sort, order }],
            paginate: pagination,
          }),

          // Use count method that works with where conditions
          this.chatbotCustomerQueryModel.countWithFilters({
            where: whereConditions,
            search,
            dateRange,
          }),
        ])

        // Return empty response if no queries found
        if (totalItems === 0 || rawQueries.length === 0) {
          return this.serviceResponse(
            HttpStatusCode.NotFound,
            { data: [], pagination: {}, filters_applied: {} },
            'No queries found',
          )
        }

        // Format queries according to IQueryDetailsResponse interface
        queries = rawQueries.map(
          (queryItem: IChatbotCustomerQuery): IQueryDetailsResponse => ({
            data: {
              ...queryItem,
              customer_name: customer.name || 'Unknown',
              customer_email: customer.email || 'N/A',
              customer_mobile: String(customer.mobile) || 'N/A',
            },
          }),
        )
      } else {
        const [rawQueries, totalItems] = await Promise.all([
          // No customer in request context - use join approach (CRM admin case)
          this.chatbotCustomerQueryModel.findWithCustomers({
            where: whereConditions,
            search,
            dateRange,
            order: [{ column: sort, order }],
            paginate: pagination,
          }),

          // Use countWithFilters that works with search and dateRange
          this.chatbotCustomerQueryModel.countWithFilters({
            where: whereConditions,
            search,
            dateRange,
          }),
        ])

        // Return empty response if no queries found
        if (totalItems === 0 || rawQueries.length === 0) {
          return this.serviceResponse(
            HttpStatusCode.NotFound,
            { data: [], pagination: {}, filters_applied: {} },
            'No queries found',
          )
        }

        // Format queries to include customer data (for rows with customer join data)
        queries = rawQueries.map(
          (queryItem: any): IQueryDetailsResponse => ({
            data: {
              ...queryItem,
              customer_name: queryItem.customer_name || 'Unknown',
              customer_email: queryItem.customer_email || 'N/A',
              customer_mobile: String(queryItem.customer_mobile) || 'N/A',
            },
          }),
        )
      }

      const totalPages = calculateTotalPages(totalItems, pagination?.perPage)

      const response: IGetQueriesResponse = {
        data: queries,
        pagination: {
          current_page: Math.floor(pagination?.page / pagination?.perPage) + 1,
          total_pages: totalPages,
          total_items: totalItems,
          per_page: pagination?.perPage,
        },
        filters_applied: {
          ...(status && { status }),
          ...(category && { category }),
        },
      }

      return this.serviceResponse(200, response, 'Queries retrieved successfully')
    } catch (error) {
      throw error
    }
  }

  async getQueryDetails(
    id: number,
    customer: Partial<ICustomer> | null,
  ): Promise<IServiceResponse> {
    try {
      // If customer exists in request (authenticated customer), filter by their customerID
      if (customer?.customerID) {
        // Get query with direct customer_id condition - no need to join
        const query = await this.chatbotCustomerQueryModel.findOne({
          where: { id, customer_id: customer.customerID },
        })

        if (!query) {
          throw new NotFoundError('Query not found for this customer')
        }

        // Get related queries from the same customer
        let relatedQueries: IChatbotCustomerQuery[] = []
        relatedQueries = await this.chatbotCustomerQueryModel.findRelatedQueries(
          customer.customerID,
          id,
        )

        // Enrich with customer data from the request
        const response: IQueryDetailsResponse = {
          data: {
            ...query,
            customer_name: customer.name || 'Unknown',
            customer_email: customer.email || 'N/A',
            customer_mobile: String(customer.mobile) || 'N/A',
            // Include related queries
            related_queries: relatedQueries,
          },
        }

        return this.serviceResponse(200, response, 'Query details retrieved successfully')
      } else {
        // No customer in request context - use join approach (CRM admin case)
        const queries = await this.chatbotCustomerQueryModel.findWithCustomers({
          where: { id },
        })

        if (!queries || queries.length === 0) {
          throw new NotFoundError('Query not found')
        }

        const query = queries[0]

        // Get related queries from the same customer
        let relatedQueries: IChatbotCustomerQuery[] = []
        if (query.customer_id) {
          relatedQueries = await this.chatbotCustomerQueryModel.findRelatedQueries(
            query.customer_id,
            query.id,
          )
        }

        const response: IQueryDetailsResponse = {
          data: {
            ...query,
            customer_name: query.customer_name || 'Unknown',
            customer_email: query.customer_email || 'N/A',
            customer_mobile: String(query.customer_mobile) || 'N/A',
            // Include related queries
            related_queries: relatedQueries,
          },
        }

        return this.serviceResponse(200, response, 'Query details retrieved successfully')
      }
    } catch (error) {
      throw error
    }
  }

  async updateQueryStatus(
    id: number,
    payload: IUpdateQueryStatusPayload,
  ): Promise<IServiceResponse> {
    try {
      const { status, resolution_notes } = payload

      // Check if query exists
      const existingQuery = await this.chatbotCustomerQueryModel.findOne({
        where: { id },
      })

      if (!existingQuery) {
        throw new NotFoundError('Query not found')
      }

      // Update query status
      const updateData: any = {
        status,
        resolution_notes: resolution_notes ? resolution_notes.trim() : null,
        updated_at: new Date(),
      }

      // Note: resolution_notes would be stored in a separate resolution log table
      // For now, we're just updating the status

      await this.chatbotCustomerQueryModel.update({ id }, updateData)

      // Retrieve the updated query
      const updatedQuery = await this.chatbotCustomerQueryModel.findOne({
        where: { id },
      })

      return this.serviceResponse(200, { query: updatedQuery }, 'Query status updated successfully')
    } catch (error) {
      throw error
    }
  }

  async createQuery(customerId: number, payload: ICreateQueryPayload): Promise<IServiceResponse> {
    try {
      const { query_category, query_text, attachment } = payload

      let attachment_url: string | null = null

      // Handle file upload if file is provided
      if (attachment) {
        // Validate file
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]

        if (!allowedMimeTypes.includes(attachment.mimetype)) {
          throw new BadRequestError(
            'Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and documents (PDF, DOC, DOCX) are allowed.',
          )
        }

        // Generate unique filename
        const timestamp = Math.floor(Date.now() / 1000)
        const fileExtension = attachment.originalname.split('.').pop()
        const filename = `${timestamp}_customer_${customerId}_query.${fileExtension}`
        const folder = 'chatbot/query-attachments'

        try {
          // Upload to S3
          const s3UploadResponse = await this.s3Service.uploadDocument(
            attachment.buffer,
            folder,
            filename,
          )

          if (!s3UploadResponse || !s3UploadResponse.Location) {
            throw new BadRequestError('Failed to upload attachment')
          }

          // Get the S3 key for generating presigned URL
          const s3Key = `${folder}/${filename}`
          attachment_url = await this.s3Service.getPresignedUrl(s3Key)

          if (!attachment_url) {
            throw new BadRequestError('Failed to generate attachment URL')
          }
        } catch (uploadError) {
          throw new BadRequestError('Failed to upload attachment to cloud storage')
        }
      }

      // Create query data
      const queryData: Partial<IChatbotCustomerQuery> = {
        customer_id: customerId,
        query_category,
        query_text: query_text.trim(),
        attachment_url: attachment_url,
        status: ChatbotQueryStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      }

      // Create the query
      const [queryId] = await this.chatbotCustomerQueryModel.create(queryData)

      // Retrieve the created query
      const createdQuery = await this.chatbotCustomerQueryModel.findOne({
        where: { id: queryId },
      })

      if (!createdQuery) {
        throw new BadRequestError('Failed to create query')
      }

      const response: ICreateQueryResponse = {
        data: createdQuery,
      }

      return this.serviceResponse(201, response, 'Query created successfully')
    } catch (error) {
      throw error
    }
  }
}
