import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { connect } from "react-redux";
import StartJobPage from "../../components/layout-components/StartJobLayout";

const ApplyMenuPage = (props) => {
  return <StartJobPage navigation={props?.navigation} route={props?.route}/>
}
const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials
  }
}
export default connect(mapStateToProps, {})(ApplyMenuPage);

const styles = StyleSheet.create({});
