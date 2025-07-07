import React from 'react'
import useToast from '../../hooks/useToast'
import Toast from 'react-native-toast-message'
import { setMechanicModifyDone, setMechanicList } from '../../redux'
import { ButtonWithIcon, FormFieldWrapper, InputText, Label, MarginSpacer, PrimaryFullButton, ScrollViewLayout, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import { useState } from 'react'
import useCheckerField from '../../hooks/useCheckerField'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { useEffect } from 'react'
import { validateEmail, validatePhone } from '../../utils/TOOLS'

const MechanicCrudPage = (props) => {
  const initialData = props?.route?.params?.item

  const [isLoading, setIsLoading] = useState(false)
  const [newData, setNewData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact: ""
  })
  const addHandler = async () => {
    if (useCheckerField(Object.values(newData)) > 0 || !validateEmail(newData.email) || !validatePhone(newData.contact)) {
      return useToast({
        type: "error",
        text1: `Please fill up the fields correctly!`,
      });
    }
    setIsLoading(true);
    newData.email = newData.email.trim()
    newData.role = 1
    newData.account_status = 1
    let result;
    if (!initialData) {
      newData.password = "mechanic"
      result = await axiosExtender("user/add", "post", newData)
    }
    else {
      result = await axiosExtender("user/update/" + initialData?._id, "put", newData)
    }

    if (result?.success) {
      loadHandler()
      useToast({
        type: "success",
        text1: `${initialData ? "Update Successfuly!" : "Added Successfuly"} `,
        onHide: () => props?.navigation.goBack()
      });

    } else {
      console.log(result)
      useToast({
        type: "error",
        text1: !result?.message.includes("duplicate") ? `Something went wrong or no internet connection!` : "Email already exits.",
        onShow: () =>
          setIsLoading(false)
      });
    }
  }
  const deleteHandler = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: async () => {
          setIsLoading(true)
          const result = await axiosExtender("user/update/" + initialData?._id, "put", { is_deleted: true })
          if (result?.success) {
            loadHandler()
            useToast({
              type: "success",
              text1: "Mechanic has been deleted.",
              onHide: props?.navigation?.goBack()
            });
          }
        }
      },
    ]);
  }
  const loadHandler = async () => {
    const result = await axiosExtender("user/find/role", "post", { role: 1, is_deleted: false })
    if (result?.success) {
      props?.setMechanicList([...result.data])
    }
  }
  useEffect(() => {
    if (initialData) {
      const { first_name, last_name, email, contact } = initialData;
      setNewData(
        {
          first_name,
          last_name,
          email,
          contact
        }
      )
    }
  }, [])


  return (
    <ScrollViewLayout>
      <FormFieldWrapper>
        <Label>First Name:</Label>
        <InputText placeholder="First Name" editable={!isLoading}
          value={newData.first_name}
          onChange={(e) => setNewData({ ...newData, first_name: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Last Name:</Label>
        <InputText placeholder="Last Name" editable={!isLoading}
          value={newData.last_name}
          onChange={(e) => setNewData({ ...newData, last_name: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Email:</Label>
        <InputText placeholder="Email" editable={!isLoading}
          value={newData.email}
          onChange={(e) => setNewData({ ...newData, email: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Contact Number: (09)</Label>
        <InputText placeholder="Contact Number" editable={!isLoading}
          value={newData.contact}
          onChange={(e) => setNewData({ ...newData, contact: e })}
        />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      <FormFieldWrapper>
        <FormFieldWrapper>
          <PrimaryFullButton onPress={() => !isLoading && addHandler()}>{isLoading ? "Submitting..." : "Submit"}</PrimaryFullButton>
        </FormFieldWrapper>
        <MarginSpacer space={2} />
        {(!isLoading && initialData) &&
          <FormFieldWrapper>
            <PrimaryFullButton custom="bg-rose-500" onPress={() => !isLoading && deleteHandler()}>Delete</PrimaryFullButton>
          </FormFieldWrapper>
        }
      </FormFieldWrapper>
      <Toast />
    </ScrollViewLayout>
  )
}

const mapStateToProps = (state) => {
  return {
    modify_done: state.mechanic.modify_done,
    selected_mechanic: state?.mechanic?.selected_mechanic
  }
}
export default connect(mapStateToProps, { setMechanicList, setMechanicModifyDone })(MechanicCrudPage)
