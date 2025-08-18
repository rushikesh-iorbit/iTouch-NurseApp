  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import Toast from 'react-native-toast-message';

  const BASE_URL = 'http://192.168.1.115:8055/api';

  export const itouchServer = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export const getCommonData = async () => {
    const authCookie = await AsyncStorage.getItem('authCookie');
    const orgName = await AsyncStorage.getItem('orgName');
    const userName = await AsyncStorage.getItem('userName');
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const nurseCode = await AsyncStorage.getItem('nurseCode');
    const wardCode = await AsyncStorage.getItem('wardCode');
    const shiftCode = await AsyncStorage.getItem('shiftCode');

    return {authCookie, orgName, userName, hospitalCode, nurseCode, wardCode, shiftCode};
  };

  export const verify2faAPI = async (otp: string) => {
    try {
      console.log('verify auth data: ', otp);
      const {authCookie, orgName, userName} = await getCommonData();
      let cookieValue = authCookie;
      // Remove "X-Auth=" if present
      if (typeof cookieValue === 'string' && cookieValue.startsWith('X-Auth=')) {
        cookieValue = cookieValue.replace('X-Auth=', '');
      }
      const response = await itouchServer.post(
        `${orgName}/user/${userName}/verify2fa`,
        {otpCode: otp},
        {
          headers: {
            Cookie: `X-Auth=${cookieValue}`, // Use only the token value
          },
        },
      );
      console.log('verify2faAPI response: ', response.data);
      return response.data;
    } catch (error: any) {
      console.error('verify 2fa API error', error?.response || error);
      throw error;
    }
  };

  export const loginNurse = async (data: {
    userName: string;
    password: string;
  }) => {
    try {
      console.log('login user data: ', data);
      const response = await itouchServer.post('user/login', data, {
        headers: {
          Cookie: '',
        },
      });
      let authCookie: string | string[] | undefined =
        response.headers['set-cookie'];
      if (Array.isArray(authCookie)) {
        authCookie = authCookie[0]; // -- Take the first cookie string
      }
      const match = authCookie?.match(/X-Auth=([^;]+)/);
      const pureToken = match?.[1];
      if (pureToken) {
        await AsyncStorage.setItem('authCookie', pureToken);
      }
      console.log('Here::', pureToken);
      // console.log('authCookie:', authCookie);
      // await AsyncStorage.setItem('authCookie', JSON.stringify(authCookie));
      //console.log('loginAPI response: ', response.data);
      return response.data;
    } catch (error: any) {
  
       if (error.response) {
      // The request was made and the server responded with a status code
      throw {
        response: {
          data: {
            message: error.response.data?.message || 'Invalid credentials'
          }
        }
      };
    } else {
      // Something happened in setting up the request
      throw {
        response: {
          data: {
            message: 'Network error. Please try again.'
          }
        }
      };
    }
      
    }
  };

  export const logoutAPI = async () => {
  try {
    const {authCookie, orgName, userName} = await getCommonData();
    const response = await itouchServer.get(
      `${orgName}/user/${userName}/logout`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('logoutAPI response: ', response);
    return response.data;
  } catch (error: any) {
    console.error('logout API error: ', error.response.data?.message || error);
    throw error;
  }
};




export const getAndCreateFcmTokenAPI = async (data: any) => {
  try {
    const {authCookie, orgName, userName} = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    if (!userName) {
      throw new Error('User name not found in AsyncStorage');
    }
    console.log('userName:', userName);
    console.log('hospitalCode:', hospitalCode);
    console.log('data:', data);
    const response = await itouchServer.post(
      `${orgName}/nurse/${hospitalCode}/${userName}/createfcmtoken`,
      data,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('The fcmtoken data ', data);
    console.log('The fcmtokenAPI response is ', response);
    console.log('update fcmtoken API response: ', response.data);
    return response.data;
  } catch (error: any) {
    console.error('update fcmtoken API error: ', error?.response || error);
    throw error;
  }
};
 

export const createNurseNoteAPI = async (noteText: any) => {
   try {
     const { authCookie, orgName, userName } = await getCommonData();
     const hospitalCode = await AsyncStorage.getItem('hospitalCode'); // <-- Add this line

     const notePayload = {
       objectId: noteText.objectId,
       objectType: noteText.objectType,
       noteType: noteText.noteType,
       note: noteText.note,
     };

     const response = await itouchServer.post(
       `${orgName}/nurse/${hospitalCode}/${userName}/createnote`,
       notePayload,
       {
         headers: {
           Cookie: `X-Auth=${authCookie}`,
         },
       }
     );
     console.log(response.data);
     return response.data;
   } catch (error: any) {
     console.error('createDoctorNoteAPI error:', error?.response || error);
     throw error;
   }
 };

 

  export const getNurseDetails= async ()=>{
    try{ 
      const {authCookie, orgName, userName} = await getCommonData();
      const hospitalCode = await AsyncStorage.getItem('hospitalCode');
      const response= await itouchServer.get(`${orgName}/nurse/${hospitalCode}/nursedetail/${userName}`,
        {
          headers: {
            Cookie: `X-Auth=${authCookie}`,
          },
        },
      );
      //console.log('get NurseDetail API response: ', response.data);
      AsyncStorage.setItem('nurseCode', response.data.nurseCode);
      AsyncStorage.setItem('nurseId', response.data.nurseId);
      return response.data;
    }catch(error:any){
      //console.error('getWardSVG API error: ', error?.response || error);
      throw error;
    }

  }

  export const getWardSVG = async () => {
  try {
    const { authCookie, orgName, userName } = await getCommonData();
    const nurse = await getNurseDetails();
    const nurseCode = nurse?.nurseCode;
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');

    // Generate current timestamp in 'YYYY-MM-DDTHH:mm:ss' format
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const currentDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const response = await itouchServer.get(
      `${orgName}/nurse/${hospitalCode}/getwardsvg/${nurseCode}/${currentDateTime}`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('get NurseDetail API response: ', response.data);
    AsyncStorage.setItem('wardCode', response.data.wardCode);
    return response.data;
  } catch (error: any) {
    // //console.error('getWardSVG API error: ', error?.response || error); 
    // Toast.show({
    //   type: 'error',
    //   text1: 'Error',  
    //   text2: 'Failed to load Ward SVG. You may not have an active shift assigned.', 
    // });
    //console.log('getWardSVG API error: ', error?.response || error);
    throw error;
  }
}

export const getBedPatientInfo = async (bedCode: string) => {
  try {
    const { authCookie, orgName, userName, wardCode } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const response = await itouchServer.get(
      `${orgName}/nurse/${hospitalCode}/bedpatientinfo/${wardCode}/${bedCode}`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('get BedPatientInfo API response: ', response.data);
    return response.data;
  } catch (error: any) {
   // console.error('getBedPatientInfo API error: ', error?.response || error);
    throw error;
  }
}

export const getCurrentShift = async () =>{
  try{
    const {authCookie, orgName, userName, wardCode} = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const currentDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const response = await itouchServer.get(
      `${orgName}/nurse/${hospitalCode}/getcurrentshift/${wardCode}/${currentDateTime}`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getCurrentShift API response: ', response.data);
    AsyncStorage.setItem('shiftCode', response.data.shiftCode);
    return response.data;
  }catch(error:any){
    console.error('getCurrentShift API error: ', error?.response || error);
    throw error;
  }
}

export const getAssignedBeds = async () => {
  try{
    const { authCookie, orgName, nurseCode, wardCode, shiftCode } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');

    const dataPayload={
      nurseCode: nurseCode,
      wardCode: wardCode,
      shiftCode: shiftCode
    }
    const response = await itouchServer.post(
      `${orgName}/nurse/${hospitalCode}/assignedbedpatients`,
      dataPayload,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getAssignedBeds API response: ', response.data);
    return response.data;
  }catch(error:any){
    console.error('getAssignedBeds API error: ', error?.response || error);
    throw error;
  }
}

export const getCurrentShiftNurses = async () => {
  try{
    const { authCookie, orgName, wardCode, shiftCode } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const response = await itouchServer.get(
      `${orgName}/nurse/${hospitalCode}/getcurrentshiftnurses/${shiftCode}/${wardCode}`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getCurrentShiftNurses API response: ', response.data);
    return response.data;
  }catch(error:any){
    console.error('getCurrentShiftNurses API error: ', error?.response || error);
    throw error;
  }
}
  
export const delegatePatient = async (data:any) =>{
  const dataPayload={
    shiftCode: data.shiftCode,
    wardCode: data.wardCode,
    patientCode: data.patientCode,
    currentNurseCode: data.currentNurseCode,
    newNurseCode: data.newNurseCode
  }
  try{
    const { authCookie, orgName, wardCode, shiftCode} = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    console.log('delegatePatient API data: ', dataPayload);
    const response = await itouchServer.post(
      `${orgName}/nurse/${hospitalCode}/delegatePatient`,
      dataPayload,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('delegatePatient API response: ', response.data);
    return response.data;
  }catch(error:any){
    console.error('delegatePatient API error: ', error?.response || error);
    throw error;
  }
}

export const getRaisedAlarm= async()=>{
  const nurseIdString = await AsyncStorage.getItem('nurseId');
  const nurseId: string[] = nurseIdString ? [nurseIdString] : [];
  const dataPayload={
    "nurseIds": nurseId,
    "shiftCode": await AsyncStorage.getItem('shiftCode'),
    "wardCode": await AsyncStorage.getItem('wardCode')
  }
  try{
    const { authCookie, orgName } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const response = await itouchServer.post(
      `${orgName}/alarmsummary/${hospitalCode}/raised/global`,
      dataPayload,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getAlarm API response: ', response.data);
    return response.data;
  }catch(error:any){
    console.error('getAlarm API error: ', error?.response || error);
    throw error;
  }
}

export const getGlobalRaisedAlarm= async()=>{
  const apiResponse = await getCurrentShiftNurses();
  console.log('Current shift nurses:', apiResponse);
  if (!apiResponse) {
    throw new Error('No current shift nurses found');
  } 
  const nurseIds: string[] = apiResponse.map((nurse: any) => nurse.nurseId);

  console.log('Nurse IDs for global alarm:', nurseIds);
  const dataPayload={
    "nurseIds": nurseIds,
    "shiftCode": await AsyncStorage.getItem('shiftCode'),
    "wardCode": await AsyncStorage.getItem('wardCode')
  }
  try{
    const { authCookie, orgName } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const response = await itouchServer.post(
      `${orgName}/alarmsummary/${hospitalCode}/raised/global`,
      dataPayload,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getGlobalAlarm API response: ', response.data);
    return response.data;
  }catch(error:any){
    console.error('getGlobalAlarm API error: ', error?.response || error);
    throw error;
  }
}

export const getEmptyBeds= async()=>{
  try{
    const { authCookie, orgName, wardCode } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const response = await itouchServer.get(
      `${orgName}/nurse/${hospitalCode}/getemptybeds/${wardCode}`,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );
    console.log('getEmptyBeds API response: ', response.data);
    return response.data;
  }catch(error:any){
    //console.error('getEmptyBeds API error: ', error?.response || error);
    throw error;
  }
}


  
 

  
