const
    normalizeAmounts = (decimals, amounts) =>
        amounts.map(
            amount => parseInt( parseFloat(amount) * Math.pow(10, decimals)),
        ),

    csvTextToBatchSendArgument =
        (decimals, text) => {
            const
                rawArgument = text
                    .split('\n')
                    .map(line => line.replace(/ /g,''))
                    .map(line => line.split(','))
                    .reduce(
                        (a,b) =>
                            ({
                                recipients: [...a.recipients, b[0]],
                                amounts: [...a.amounts, b[1]],
                            }),
                        {recipients: [], amounts: []},
                    )
            return {
                recipients: rawArgument.recipients,
                amounts: normalizeAmounts(decimals, rawArgument.amounts)
            }
        }

module.exports = {csvTextToBatchSendArgument}
