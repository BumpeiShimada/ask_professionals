import React, {useContext} from 'react';
import {ScrollView} from 'react-native';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';
import {TextInput, Button, Headline, HelperText} from 'react-native-paper';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import {
  InputFieldSeparater,
  FormContainer,
  ButtonSeparater,
} from '../components/FormComponents';
import {ProfileFormValidation} from '../validations/profileForm';
import useDistinctNavigation from '../utils/useDistinctNavigation';
import {UpdateAdvisorDocumentStateArgs} from '../models/advisor';
import useAdvisor from '../utils/useAdvisor';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const CenteredHeadline = styled(Headline)`
  margin-top: 20px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const ProfileEditScreen = () => {
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();
  const navigation = useDistinctNavigation();

  let initialValues: UpdateAdvisorDocumentStateArgs = {
    name: '',
    twitterUrl: '',
    detail: '',
    cardProfile: '',
  };

  const currentAdvisorDocumentState = advisorState.advisorDocumentState;
  if (currentAdvisorDocumentState) {
    const {name, twitterUrl, detail, cardProfile} = currentAdvisorDocumentState;
    initialValues = {name, twitterUrl, detail, cardProfile};
  }

  return (
    <ScrollView>
      <Container>
        <CenteredHeadline>
          {
            'Thank you for selecting!\nPlease fill your profiles next\n✅'
          }
        </CenteredHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileFormValidation}
          onSubmit={(values) => {
            advisor.updateAdvisorDocumentState(values);
            navigation.navigateToImageUpload();
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <FormContainer>
              <TextInput
                label="Name"
                mode="outlined"
                autoCapitalize="none"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name ? (
                <HelperText type="error">{errors.name}</HelperText>
              ) : null}

              <InputFieldSeparater />

              <TextInput
                label="Twitter URL (optional)"
                mode="outlined"
                autoCapitalize="none"
                onChangeText={handleChange('twitterUrl')}
                onBlur={handleBlur('twitterUrl')}
                value={values.twitterUrl}
              />
              {touched.twitterUrl && errors.twitterUrl ? (
                <HelperText type="error">{errors.twitterUrl}</HelperText>
              ) : null}

              <InputFieldSeparater />

              <TextInput
                multiline
                label="Detailed profiles"
                mode="outlined"
                numberOfLines={4}
                autoCapitalize="none"
                onChangeText={handleChange('detail')}
                onBlur={handleBlur('detail')}
                value={values.detail}
              />
              {touched.detail && errors.detail ? (
                <HelperText type="error">{errors.detail}</HelperText>
              ) : null}

              <InputFieldSeparater />

              <TextInput
                multiline
                label="Short profile (max 140)"
                mode="outlined"
                autoCapitalize="none"
                onChangeText={handleChange('cardProfile')}
                onBlur={handleBlur('cardProfile')}
                value={values.cardProfile}
              />
              {touched.cardProfile && errors.cardProfile ? (
                <HelperText type="error">{errors.cardProfile}</HelperText>
              ) : null}

              <ButtonSeparater />

              <ButtonContainer>
                <Button mode={'contained'} onPress={handleSubmit}>
                  Check
                </Button>
              </ButtonContainer>
            </FormContainer>
          )}
        </Formik>
      </Container>
    </ScrollView>
  );
};

export default ProfileEditScreen;
