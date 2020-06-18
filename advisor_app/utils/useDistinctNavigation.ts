import {useNavigation} from '@react-navigation/native';
import {UserInfo, UserDetail} from '../models/user';

/* 
  This Hook is declared so that we could prohibit
  re-assigning route name for each page
*/
function useDistinctNavigation() {
  const navigation = useNavigation();

  function navigateToLogin() {
    navigation.navigate('Login');
  }

  function navigateToConversation(userInfo: UserInfo) {
    navigation.navigate('Conversation', {userInfo});
  }

  function navigateToUserDetail(userDetail: UserDetail) {
    navigation.navigate('UserDetail', {userDetail});
  }

  function navigateToMyPage() {
    navigation.navigate('MyPage');
  }

  function navigateToTagSelect() {
    navigation.navigate('TagSelect');
  }

  function navigateToProfileEdit() {
    navigation.navigate('ProfileEdit');
  }

  function navigateToImageUpload() {
    navigation.navigate('ImageUpload');
  }

  function navigateToProfileEditConfirm() {
    navigation.navigate('ProfileEditConfirm');
  }

  function goBack() {
    navigation.goBack();
  }

  return {
    navigateToLogin,
    navigateToConversation,
    navigateToUserDetail,
    navigateToMyPage,
    navigateToTagSelect,
    navigateToProfileEdit,
    navigateToImageUpload,
    navigateToProfileEditConfirm,
    goBack,
  };
}

export default useDistinctNavigation;
