import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigate } from '../navigation/navigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNurseNoteAPI } from '../services/nurseService';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};

export const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
};

const displayNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  const { data } = remoteMessage;
  
  await notifee.displayNotification({
    title: typeof data?.title === 'string' ? data.title : 'Notification',
    body: typeof data?.body === 'string' ? data.body : '',
    data: data || {},
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
      //smallIcon: 'ic_launcher', // optional, use your app icon
      actions: [
        { title: 'View Details', pressAction: { id: 'view_details', launchActivity: 'default', } },
        { title: 'Mark as Read', pressAction: { id: 'mark_as_read' } },
        { title: 'Send Instructions', pressAction: { id: 'send_instructions', launchActivity: 'default', } },
      ],
    },
  });
};

export const notificationListener = async () => {
  messaging().onMessage(async remoteMessage => {
    console.log('FCM Message in foreground:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    await displayNotification(remoteMessage);
  });

  notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      const actionId = detail.pressAction?.id;
      const notificationData = detail.notification?.data || {};

      console.log('Action pressed:', actionId);

      if (actionId === 'view_details') {
        navigate('Dashboard'); // Update with your actual screen name
      }

      if (actionId === 'mark_as_read') {
        const userId = await AsyncStorage.getItem('userId');
        const title = notificationData.title || '';
        const body = notificationData.body || '';

        const notePayload = {
          objectId: userId,
          objectType: 'NURSE', // or 'DOCTOR' or whatever is relevant
          noteType: 'push notification action button',
          note: `action: mark as read (title: ${title}, body: ${body})`,
        };

        try {
          await createNurseNoteAPI(notePayload);
          console.log('Note saved:', notePayload);
        } catch (e) {
          console.error('Failed to save note:', e);
        }
      }

      if (actionId === 'send_instructions') {
        navigate('Dashboard'); // Update to your target screen
      }
    }
  });

  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification?.pressAction?.id) {
    const actionId = initialNotification.pressAction.id;

    if (actionId === 'view_details') {
      navigate('Dashboard');
    } else if (actionId === 'send_instructions') {
      navigate('Dashboard');
    }
  }

};
