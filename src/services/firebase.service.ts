import config from '@/config/default'
import axios from 'axios'
class FirebaseNotificationService {
  // public users = new PrismaClient().user;
  public serverKey = config.firebaseServerKey
  public async sendNotificationForSecondDeviceLogin(
    token: string,
    customerID: string,
  ): Promise<void> {
    const payload = {
      notification: {
        title: 'New Login Received',
        body: 'Someone logged in from another device.',
      },
      data: {
        customerId: customerID,
        notificationType: 'New Device Login',
        deepLinkUrl: 'Login',
      },
      to: token,
    }
    try {
      // Make a POST request to Firebase FCM REST API
      const response = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${this.serverKey}`,
          },
        },
      )

      // Log the response or handle it as needed
      console.log('Notification sent successfully')
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }
}

export default FirebaseNotificationService
