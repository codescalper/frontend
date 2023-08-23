import { isEthAddress, isLensterUrl } from "./validation";

export const handleChange = (e, modal, setModal) => {
  const { value } = e.target;

  // if it is a valid erc20 address
  if (value.startsWith("0x")) {
    const isValid = isEthAddress(value);
    if (isValid) {
      setModal({
        ...modal,
        isError: false,
        errorMsg: "",
        stTokengateIpValue: value,
      });
    } else {
      setModal({
        ...modal,
        isError: true,
        errorMsg: "Invalid ERC20 address",
        stTokengateIpValue: value,
      });
    }
    
    // if it is a valid lenster link
  } else if (value.startsWith("https://lenster.xyz")) {
    const isValidLink = isLensterUrl(value);

    if (isValidLink) {
      setModal({
        ...modal,
        isError: false,
        errorMsg: "",
        stTokengateIpValue: value,
      });
    } else {
      setModal({
        ...modal,
        isError: true,
        errorMsg: "Invalid Lenster link",
        stTokengateIpValue: value,
      });
    }

    // if value is empty
  } else if (!value) {
    setModal({
      ...modal,
      isError: false,
      errorMsg: "",
      stTokengateIpValue: value,
    });

    // if value is invalid
  } else {
    setModal({
      ...modal,
      isError: true,
      errorMsg: "Invalid input",
      stTokengateIpValue: value,
    });
  }
};
