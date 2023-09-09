const ex = {
  userA: {
    canvasStoreData: {
      refferedFrom: ["userA"],
    },
  },
  userB: {
    userTemplateData: {
      refferedFrom: ["userA"],
    },
    canvasData: {
      refferedFrom: ["userA", "userB"],
    },
  },
  userC: {
    userTemplateData: {
      refferedFrom: ["userA", "userB"],
    },
    canvasData: {
      refferedFrom: ["userA", "userB", "userC"],
    },
  },
    userD: {
    userTemplateData: {
        refferedFrom: ["userA", "userB", "userC"],
    }
    }
};

// if it is a new template
const privateRefferedFrom = [currentUserAddess] = pass

// if it is a private template and using any lens collection
const privateLensRefferedFrom = [currentUserAddess, lensHandles] = pass

// if it is a public template
const publicRefferedFrom = [...refferedFrom, currentUserAddess]

// if it is a public template and using any lens collection
const publicLensRefferedFrom = [...refferedFrom, currentUserAddess, lensHandles]