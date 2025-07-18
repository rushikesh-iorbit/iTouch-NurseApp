  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import Toast from 'react-native-toast-message';

  const BASE_URL = 'http://192.168.1.128:8055/api';

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
    
    return {authCookie, orgName, userName, hospitalCode };
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
    const { authCookie, orgName, userName } = await getCommonData();
    const hospitalCode = await AsyncStorage.getItem('hospitalCode');
    const wardCode = await AsyncStorage.getItem('wardCode');
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
  

  
 

  
