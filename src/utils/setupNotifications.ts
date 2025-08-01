// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType, EventDetail } from '@notifee/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createNurseNoteAPI } from '../services/nurseService';
// import { navigate } from '../navigation/navigationService';

// const getTitle = (msg: FirebaseMessagingTypes.RemoteMessage): string => {
//   const title = msg.data?.title;
//   return typeof title === 'string' ? title : 'Notification';
// };

// const getBody = (msg: FirebaseMessagingTypes.RemoteMessage): string => {
//   const body = msg.data?.body;
//   return typeof body === 'string' ? body : '';
// };

// export const setupNotifications = async () => {
//   await messaging().requestPermission();
//   await notifee.requestPermission();

//   await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//     importance: AndroidImportance.HIGH,
//   });

//   const unsubscribe = messaging().onMessage(
//     async (msg: FirebaseMessagingTypes.RemoteMessage) => {
//       await notifee.displayNotification({
//         title: getTitle(msg),
//         body: getBody(msg),
//         android: {
//           channelId: 'default',
//           importance: AndroidImportance.HIGH,
//           smallIcon: 'ic_launcher', 
//           actions: [
//             { title: 'View Details', pressAction: { id: 'view_details' } },
//             { title: 'Mark as Read', pressAction: { id: 'mark_as_read' } },
//             { title: 'Send Instructions', pressAction: { id: 'send_instructions' } },
//           ],
//         },
//         data: msg.data,
//       });
//     }
//   );

//   messaging().setBackgroundMessageHandler(
//     async (msg: FirebaseMessagingTypes.RemoteMessage) => {
//       await notifee.displayNotification({
//         title: getTitle(msg),
//         body: getBody(msg),
//         android: {
//           channelId: 'default',
//           importance: AndroidImportance.HIGH,
//           smallIcon: 'ic_launcher',
//           actions: [
//             { title: 'View Details', pressAction: { id: 'view_details' } },
//             { title: 'Mark as Read', pressAction: { id: 'mark_as_read' } },
//             { title: 'Send Instructions', pressAction: { id: 'send_instructions' } },
//           ],
//         },
//         data: msg.data,
//       });
//     }
//   );

//   const unsubscribeNotifee = notifee.onForegroundEvent(
//     async ({
//       type,
//       detail,
//     }: {
//       type: EventType;
//       detail: EventDetail;
//     }) => {
//       const actionId = detail?.pressAction?.id;
//       const data = detail?.notification?.data ?? {};

//       switch (actionId) {
//         case 'view_details':
//           navigate('BedPatientInfo', { data });
//           break;

//         case 'mark_as_read': {
//           const userId = await AsyncStorage.getItem('userId');
//           const note = {
//             objectId: userId,
//             objectType: 'NURSE',
//             noteType: 'push notification',
//             note: `action: mark as read (title: ${data.title} body: ${data.body})`,
//           };
//           try {
//             await createNurseNoteAPI(note);
//           } catch (error) {
//             console.error('Failed to save nurse note:', error);
//           }
//           break;
//         }

//         case 'send_instructions':
//           navigate('Dashboard'); 
//           break;
//       }
//     }
//   );

//   return () => {
//     unsubscribe();
//     unsubscribeNotifee();
//   };
// };
