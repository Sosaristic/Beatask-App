import {Dialog, Portal, Text} from 'react-native-paper';
import {CustomButton, CustomInput} from '..';
import {TouchableOpacity} from 'react-native';
import {customTheme} from '../../custom_theme/customTheme';
import {useState} from 'react';

const ReportModal = ({
  visible,
  hideDialog,
  handleSubmit,
}: {
  visible: boolean;
  hideDialog: () => void;
  handleSubmit: (reason: string) => void;
}) => {
  const [reason, setReason] = useState('');

  const onSubmit = () => {
    handleSubmit(reason);
    hideDialog();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Report Account</Dialog.Title>
        <Dialog.Content>
          <CustomInput
            value={reason}
            onChangeText={setReason}
            label="Enter Report"
            multiline
            numberOfLines={4}
          />
        </Dialog.Content>
        <Dialog.Actions
          style={{
            alignItems: 'center',

            justifyContent: 'center',
          }}>
          <TouchableOpacity
            disabled={!reason}
            onPress={onSubmit}
            style={{
              width: '100%',
              alignItems: 'center',
              backgroundColor: !reason ? 'grey' : customTheme.primaryColor,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text variant="bodyMedium" style={{color: '#000'}}>
              Submit
            </Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ReportModal;
