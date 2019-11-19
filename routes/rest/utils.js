
/**
 * 
 */
checkIfTranslationNotOk = (t, errTranslationKey) => {
	return t === undefined ||
		t['ERRORS'] === undefined ||
		t['ERRORS'][errTranslationKey] === undefined;
}
module.exports.checkIfTranslationNotOk = checkIfTranslationNotOk;