import {useNavigation} from '@react-navigation/native';
import {AdvisorCardInterface} from '../models/homeTab/homeScreen';

// This Hooks is declared so that we could prohibit
// re-assigning route name for each page
function useDistinctNavigation() {
  // For using this Hooks, distinct navigations are declared as Hooks.
  const navigation = useNavigation();

  function navigateToHome() {
    navigation.navigate('Home');
  }

  function navigateToMyPage() {
    navigation.navigate('MyPage');
  }

  function navigateToMailAddressLinking() {
    navigation.navigate('MailAddressLinking');
  }

  function navigateToTagSelect() {
    navigation.navigate('TagSelect');
  }

  function navigateToProfileEdit() {
    navigation.navigate('ProfileEdit');
  }

  function navigateToAdvisorDetail(advisorCard: AdvisorCardInterface) {
    navigation.navigate('AdvisorDetail', {advisorCard});
  }

  function navigateToConversation(advisorId: string) {
    navigation.navigate('Conversation', {advisorId});
  }

  function navigateToLogin() {
    navigation.navigate('Login');
  }

  function goBack() {
    navigation.goBack();
  }

  return {
    navigateToHome,
    navigateToMyPage,
    navigateToMailAddressLinking,
    navigateToTagSelect,
    navigateToProfileEdit,
    navigateToAdvisorDetail,
    navigateToConversation,
    navigateToLogin,
    goBack,
  };
}

export default useDistinctNavigation;
