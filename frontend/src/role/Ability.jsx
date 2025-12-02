import { getUserDetails } from "../userDetails";

const Ability = (roles = []) => {
  let role = getUserDetails()?.role;
  if (roles.includes(role)) {
    return true;
  } else {
    return false;
  }
};

export default Ability;