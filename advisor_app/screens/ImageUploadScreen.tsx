import React, {useState, useContext} from 'react';
import storage from '@react-native-firebase/storage';
import styled from 'styled-components/native';
import {ScrollView} from 'react-native';
import {Headline, Button, Card, Paragraph} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import useDistinctNavigation from '../utils/useDistinctNavigation';
import AdvisorStateContext from '../globalContexts/AdvisorStateContext';
import SnackbarContext from '../globalContexts/SnackbarContext';
import useAdvisor from '../utils/useAdvisor';

const Container = styled.View`
  flex: 1;
  margin: 20px;
  flex-direction: column;
  justify-content: center;
`;

const CenteredHeadline = styled(Headline)`
  text-align: center;
`;

const CenteredParagraph = styled(Paragraph)`
  text-align: center;
  margin: 20px 0px;
`;

const ImageUploadButton = styled(Button)`
  height 100px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const VerticalSeparator = styled.View`
  height: 30px;
`;

const options = {
  title: 'Load Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const ImageUploadScreen = () => {
  const navigation = useDistinctNavigation();
  const advisorState = useContext(AdvisorStateContext);
  const advisor = useAdvisor();

  const [isPickingImage, setIsPickingImage] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isNeverUploaded, setIsNeverUploaded] = useState<boolean>(
    advisorState.advisorDocumentState?.isRegistrationDone === false,
  );
  const {showUnknownErrorMessage} = useContext(SnackbarContext);

  /*
    Since the only logged in user can access to this page,
    this must not be undefined.
  */
  const uid = advisorState.advisorAuthState ? advisorState.advisorAuthState.uid : '';
  const profileImageRef = storage().ref(`images/advisors/${uid}/profile.jpg`);

  return (
    <ScrollView>
      <Container>
        <CenteredHeadline>
          {'Lastly, give me your\namazing shot\n📸'}
        </CenteredHeadline>
        {isPickingImage &&
          ImagePicker.showImagePicker(options, async (response) => {
            setIsPickingImage(false);

            try {
              if (response.didCancel) {
                // Just ignore so that it doesn't raise unnecessary error
              } else if (response.error) {
                showUnknownErrorMessage();
              } else {
                setIsPickingImage(false);
                setIsUploadingImage(true);

                await profileImageRef.putString(response.data, 'base64', {
                  contentType: 'image/jpeg',
                });

                const imageUrl = await profileImageRef.getDownloadURL();
                advisor.updateAdvisorImageUrl({imageUrl});

                setIsNeverUploaded(false);
                setIsUploadingImage(false);
              }
            } catch {
              showUnknownErrorMessage();
              setIsUploadingImage(false);
            }
          })}

        <VerticalSeparator />

        <Card elevation={10}>
          <Card.Cover
            source={{
              uri:
                advisorState.advisorDocumentState &&
                advisorState.advisorDocumentState.imageUrl.length > 0
                  ? advisorState.advisorDocumentState.imageUrl
                  : '',
            }}
          />
        </Card>
        <ImageUploadButton
          disabled={isUploadingImage}
          loading={isUploadingImage}
          icon="camera-image"
          mode="contained"
          onPress={() => setIsPickingImage(true)}>
          {isUploadingImage ? 'Uploading' : 'Select picture'}
        </ImageUploadButton>

        <CenteredParagraph>
          {
            'It might take sometime\nuntil the uploaded photo\nis shown here'
          }
        </CenteredParagraph>

        <ButtonContainer>
          <Button
            disabled={isUploadingImage || isNeverUploaded}
            mode="contained"
            onPress={navigation.navigateToProfileEditConfirm}>
            Check
          </Button>
        </ButtonContainer>
      </Container>
    </ScrollView>
  );
};

export default ImageUploadScreen;
