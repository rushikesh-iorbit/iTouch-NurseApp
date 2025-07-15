// nurse-app/screens/NurseLoginScreen.tsx
import SharedLoginScreen from '../../components/shared/ui/SharedLoginScreen';
import { loginNurse } from '../../services/nurseService';
// import { loginAPI } from '../../services/api';

const NurseLogin = () => {

  return (
        <SharedLoginScreen
        title="iTouch Nurse"
        description="This app is built to streamline ICU tasks for nurses..."
        imageSource={require('../../../assets/images/nurse.png')}
        logoSource={require('../../../assets/images/hospital_logo.jpg')}
        // onLogin={(username, password) => loginNurse({ userName: username, password })}
        onLogin={(username, password) => loginNurse({ userName: username, password })}
        />
  );
};

export default NurseLogin;
