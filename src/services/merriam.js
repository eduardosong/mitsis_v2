import axios from "axios";

const KEY = "2b83e154-1063-4118-a1c8-b13f7bd952a1";

export const baseParams = {
  key: KEY
};

export default axios.create({
  baseURL: "https://www.dictionaryapi.com/api/v3"
});
