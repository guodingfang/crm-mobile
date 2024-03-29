const getters = {
  headerHeight: state => state.util.headerHeight,
  pageLoading: state => state.util.pageLoading,
  userInfo: state => state.user.userInfo,
  currentCustomer: state => state.customer.currentCustomer,
  restCustomerList: state => state.customer.restCustomerList,
  contactsInfo: state => state.customer.contactsInfo,
  provinceList: state => state.util.provinceList,
  customerCharacter: state => state.util.customerCharacter,
  customerType: state => state.util.customerType,
  currentVisit: state => state.visit.currentVisit,
  clockRecordId: state => state.visit.clockRecordId,
  updateRecord: state => state.visit.updateRecord,
  currentProject: state => state.week.currentProject,
  contactsRol: state => state.util.contactsRol
}

export default getters
