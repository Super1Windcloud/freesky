import axios from "axios";


export const registerEnv = async () => {

  const res = await axios.get("/env");
  const env = res.data;
  console.log(env);
  return env;
};


