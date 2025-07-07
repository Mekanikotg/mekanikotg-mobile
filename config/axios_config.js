import axios from "axios";

const axios_config = axios.create({
  // baseURL: "http://127.0.0.1:5000/api/"
  baseURL: "https://mekanikotg-server.onrender.com/api/",
});

export const axiosExtender = async (query, method, data) => {
  try {
    let res = null;
    switch (method) {
      case "get":
        res = await axios_config.get(query)
        break;
      case "post":
        res = await axios_config.post(query, data)
        break;
      case "put":
        res = await axios_config.put(query, data)
        break;
      case "delete":
        res = await axios_config.delete(query + data)
        break;
      default:
        break;
    }
    return res?.data;
  } catch (e) {
    console.log(e)
    return { success: false, message: e };
  }
};
