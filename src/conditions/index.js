

function calcConditions(params) {
  const permErrors = calcPermissions(params).errors;
    if (permErrors) {
    return {
      errors: [
        { type: 'Permission error', ...permErrors }
      ]
    }
  }

  const { paidPart, upgradePart } = calcPaidAndUpgradeParts(params);

  //


}