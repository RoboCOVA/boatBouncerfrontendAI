// ** Icon Imports
import { Icon } from "@iconify/react";

const IconifyIcon = ({ icon, ...rest }) => {
  return <Icon icon={icon} fontSize="1.375rem" {...rest} />;
};

IconifyIcon.displayName = "IconifyIcon";
export default IconifyIcon;
