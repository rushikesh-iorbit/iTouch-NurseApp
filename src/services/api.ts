  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';

  const BASE_URL = 'https://192.168.1.115:8055/api';

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

  export const loginAPI = async (data: {
    userName: string;
    password: string;
  })=> {
  try {
    console.log('URL: ', itouchServer.defaults.baseURL);
    console.log('login user data: ', data);
    const response = await itouchServer.post(`user/login`, data, {
      headers: {
        Cookie: '',
      },
    });
    const authCookie = response.headers['set-cookie'];
    await AsyncStorage.setItem('authCookie', JSON.stringify(authCookie));

    console.log('loginAPI response: ', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login API error: ', error?.response || error);
    throw error;
  }
};

export const verifyEmailAPI = async (data:{otp:string}) => {
  try {
    console.log('verify email data: ', data);
    const {authCookie, orgName, userName} = await getCommonData();
    const response = await itouchServer.post(
      `${orgName}/user/${userName}/verification`,
      data,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
        },
      },
    );

    console.log('verifyEmailAPI response: ', response.data);
    return response.data;
  } catch (error: any) {
    console.error('email Verification API error: ', error?.response || error);
    throw error;
  }
};

export const verify2faAPI = async (data: {otp:string}) => {
  try {
    console.log('verify auth data: ', data);
    const {authCookie, orgName, userName} = await getCommonData();
    const response = await itouchServer.post(
      `${orgName}/user/${userName}/verify2fa`,
      data,
      {
        headers: {
          Cookie: `X-Auth=${authCookie}`,
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
    console.error('logout API error: ', error?.response || error);
    throw error;
  }
};