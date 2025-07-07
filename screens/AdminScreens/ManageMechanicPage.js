import { StyleSheet, } from "react-native";
import React, { useState } from "react";
import { setAgentList } from "../../redux"
import {
    ButtonWithIcon,
    FlexHorizontalLayout,
    FormFieldWrapper,
    Heading3,
    InputText,
    MarginSpacer,
    Paragraph,
    PrimaryFullButton,
    ScrollViewLayout,
    SimpleCard,
} from "../../components";
import { ICONS } from "../../utils";
import { useEffect } from "react";
import { axiosExtender } from "../../config/axios_config";
import { connect } from "react-redux";
const ManageMechanicPage = (props) => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const mechanic_list = data.filter(
        (d) =>
            d?.email.toLowerCase().includes(search.toLowerCase()) ||
            (d?.first_name.toLowerCase() + d?.last_name.toLowerCase()).includes(search.toLowerCase())
    );

    const addHandler = () => {
        props?.navigation.navigate("admin-mechanic-crud")
    }
    const modifyHandler = (item) => {
        props?.navigation?.navigate("admin-mechanic-crud", { item })
    }
    const load = async () => {
        const result = await axiosExtender("user/find/role", "post", { role: 1, is_deleted: false })
        if (result?.success) {
            setData(result.data)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        load()
    }, [props?.mechanic_list])

    return (
        <ScrollViewLayout>
            <FormFieldWrapper>
                <InputText placeholder="Search here..." onChange={setSearch} />
            </FormFieldWrapper>
            <MarginSpacer space={2} />
            {isLoading ?
                <Paragraph custom="text-center w-full">Fetching information...</Paragraph>
                :
                <>
                    <FlexHorizontalLayout>
                        <Heading3>Listed: {mechanic_list?.length}</Heading3>
                        <ButtonWithIcon
                            wrapperCustom="bg-zinc-900 p-3"
                            contentCustom="text-white text-md"
                            onPress={addHandler}
                            icon={ICONS.PLUS}
                            text="Add Mechanic"
                        />
                    </FlexHorizontalLayout>
                    {mechanic_list.length > 0 ? (
                        mechanic_list.map((item, key) => (
                            <SimpleCard key={"mechanic" + key} onPress={() => modifyHandler(item)}>
                                <Paragraph>Name: {item?.first_name} {item?.last_name}</Paragraph>
                                <Paragraph>Email: {item?.email}</Paragraph>
                            </SimpleCard>
                        ))
                    ) : (
                        <Paragraph>{search.trim().length > 0 ? "Mechanic not found" : "No mechanic listed"}</Paragraph>
                    )}
                </>
            }
        </ScrollViewLayout>
    );
};
const mapStateToProps = state => {
    return {
        mechanic_list: state.mechanic.mechanic_list
    }
}
export default connect(mapStateToProps, { setAgentList })(ManageMechanicPage);

const styles = StyleSheet.create({});
