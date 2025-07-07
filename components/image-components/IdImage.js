import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const IdImage = ({ uri }) => {
    return (
        <View style={{
            width: "100%",
            aspectRatio: 16 / 16,
            overflow: "hidden", // Ensure content doesn't overflow
        }}
            className="bg-zinc-200">
            {uri &&
                <Image
                    style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "contain", // Preserve aspect ratio without stretching
                    }}
                    source={{ uri }}
                />
            }
        </View>
    )
}

export default IdImage

const styles = StyleSheet.create({})