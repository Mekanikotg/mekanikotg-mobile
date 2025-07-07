import React from 'react'
import { ButtonWithIcon, FormFieldWrapper, InputText, Label, MarginSpacer, PrimaryFullButton, StartLayout } from '../../components'
import { axiosExtender } from '../../config/axios_config'
import useToast from '../../hooks/useToast'
import Toast from 'react-native-toast-message'
import { useState } from 'react'
import { setTowingList, setTowingModifyDone } from "../../redux"
import useCheckerField from '../../hooks/useCheckerField'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { ICONS } from '../../utils'
import { Alert } from 'react-native'
import { validatePhone } from '../../utils/TOOLS'

const TowingCrudPage = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [newData, setNewData] = useState({
    company_name: "",
    contact: "",
    city: ""
  })
  const addHandler = async () => {
    if (useCheckerField(Object.values(newData)) > 0 || !validatePhone(newData.contact)) {
      return useToast({
        type: "error",
        text1: `Please fill up the fields correctly!`,
      });
    }
    setIsLoading(true);
    let result;
    if (!props?.selected_towing) {
      result = await axiosExtender("towing/add", "post", newData)
    }
    else {
      result = await axiosExtender("towing/update/" + props?.selected_towing?._id, "put", newData)
    }
    if (result?.success) {
      useToast({
        type: "success",
        text1: `${props?.selected_towing ? "Update Successfuly!" : "Added Successfuly"} `,
      });
      if (!props?.selected_towing) {
        setNewData(
          {
            company_name: "",
            contact: "",
            city: ""
          }
        )
      }
      await loadHandler()
    } else {
      useToast({
        type: "error",
        text1: `Something went wrong or no internet connection!`,
        onShow: () =>
          setIsLoading(false)
      });
    }
    setIsLoading(false);

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
          await axiosExtender("towing/delete/", "delete", props?.selected_towing?._id)
          await loadHandler()
          props?.navigation?.navigate("admin-towing")
        }
      },
    ]);
  }
  const loadHandler = async () => {
    const result = await axiosExtender("towing", "get")
    if (result?.success) {
      props?.setTowingList([...result.data])
      props?.setTowingModifyDone(!props.modify_done)
    }
  }
  useEffect(() => {
    if (props?.selected_towing) {
      const { company_name, contact, city } = props?.selected_towing;
      setNewData(
        {
          company_name,
          contact,
          city,
        }
      )
    }
  }, [props?.selected_towing])
  return (
    <StartLayout>
      <FormFieldWrapper>
        <Label>Company Name:</Label>
        <InputText placeholder="Company Name" editable={!isLoading}
          value={newData.company_name}
          onChange={(e) => setNewData({ ...newData, company_name: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>Contact Number: (09)</Label>
        <InputText placeholder="Contact Number" editable={!isLoading}
          value={newData.contact}
          onChange={(e) => setNewData({ ...newData, contact: e })}
        />
      </FormFieldWrapper>
      <FormFieldWrapper>
        <Label>City:</Label>
        <InputText placeholder="City" editable={!isLoading}
          value={newData.city}
          onChange={(e) => setNewData({ ...newData, city: e })}
        />
      </FormFieldWrapper>
      <MarginSpacer space={2} />
      <FormFieldWrapper>
        {props?.selected_towing ?
          <>
            <ButtonWithIcon
              icon={ICONS.SAVE}
              activeOpacity={isLoading && 1}
              wrapperCustom="bg-zinc-900 p-4"
              onPress={() => !isLoading && addHandler()}
              contentCustom="text-white text-lg"
              text={isLoading ? "Saving..." : "Save Changes"} />
            <MarginSpacer space={2} />
            {!isLoading &&
              <ButtonWithIcon
                icon={ICONS.TRASHBIN}
                activeOpacity={isLoading && 1}
                wrapperCustom="bg-rose-500 p-4"
                onPress={() => !isLoading && deleteHandler()}
                contentCustom="text-white text-lg"
                text="Delete" />
            }

          </>
          :
          <PrimaryFullButton activeOpacity={isLoading && 1} onPress={() => !isLoading && addHandler()}>
            {isLoading ? "Submitting..." : "Submit"}
          </PrimaryFullButton>
        }
      </FormFieldWrapper>
      <Toast />
    </StartLayout>
  )
}
const mapStateToProps = (state) => {
  return {
    modify_done: state.towing.modify_done,
    selected_towing: state?.towing?.selected_towing
  }
}
export default connect(mapStateToProps, { setTowingList, setTowingModifyDone })(TowingCrudPage)
