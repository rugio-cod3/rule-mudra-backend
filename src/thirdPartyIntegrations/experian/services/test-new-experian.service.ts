import NewExperianService from './new-experian.service'

// Simple test to verify the service can be instantiated
const testService = () => {
    try {
        const experianService = new NewExperianService()
        console.log('✅ NewExperianService created successfully')
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(experianService)))
        return true
    } catch (error) {
        console.error('❌ Error creating NewExperianService:', error)
        return false
    }
}

export { testService }