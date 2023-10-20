
// Add an input field on Button click
export const addSolanaInputBox = (name) => {
  if (name == "onChainSplits") {
    if (solanaEnabled.arrOnChainSplitRecipients.length < 5) {
      setSolanaEnabled({
        ...solanaEnabled,
        arrOnChainSplitRecipients: [
          ...solanaEnabled.arrOnChainSplitRecipients,
          { recipient: "", split: 1.0 },
        ],
      });
    }
  }

  if (name == "allowlist") {
    if (solanaEnabled.arrAllowlist.length < 5) {
      setSolanaEnabled({
        ...solanaEnabled,
        arrAllowlist: [
          ...solanaEnabled.arrAllowlist,
          {  },
        ],
      });
    }
  }
};


const restrictRecipientInput = (e, index, recipient) => {
  const isText = parentOnChainSplitsRef?.current.includes(recipient.recipient);
  const isUserAddress = recipient.recipient === address;
  if (index === 0 || isText) {
    if (isUserAddress) {
      handleRecipientChange(index, "recipient", e.target.value);
    }
  } else {
    handleRecipientChange(index, "recipient", e.target.value);
  }
};

const restrictremoveRecipientInputBox = (index, recipient) => {
  const istext = parentOnChainSplitsRef?.current.includes(recipient.recipient);
  if (index === 0 || istext) {
    return true;
  }
};
