const DP2SIZE = 80
const DP1SIZE = 200
const DP3SIZE = 60
const ARROWSIZE = 15

export default EXTERNALSTYLE = {
    dp2:
    {
        objectFit: "cover",
        maxWidth: DP1SIZE,
        maxHeight: DP1SIZE,
        minWidth: DP1SIZE,
        minHeight: DP1SIZE,
        borderRadius: 500,
        borderWidth: 5,
        borderColor: "#fff"
    },
    dp:
    {
        objectFit: "cover",
        maxWidth: DP2SIZE,
        maxHeight: DP2SIZE,
        minWidth: DP2SIZE,
        minHeight: DP2SIZE,
        height: DP2SIZE,
        width: DP2SIZE,
        borderRadius: 500,
        borderWidth: 3,
        borderColor: "#fff"

    },
    chat_head: {
        maxWidth: DP3SIZE,
        maxHeight: DP3SIZE,
        minWidth: DP3SIZE,
        minHeight: DP3SIZE,
        borderRadius: 500,
        borderWidth: 3,
        borderColor: "#f4f4f4"
    },
    arrow_right: {
        maxWidth: ARROWSIZE,
        maxHeight: ARROWSIZE,
        minWidth: ARROWSIZE,
        minHeight: ARROWSIZE,
    }
}