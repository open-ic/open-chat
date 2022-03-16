export function validateInput(value: string, powTenPerWhole: number): [string, bigint] {
    if (value.length > 0) {
        const parts = value.split(".");
        if (parts.length === 1) {
            const integralString = parts[0];
            const integral = Number.parseInt(integralString);

            if (Number.isSafeInteger(integral)) {
                return [integralString, BigInt(integral) * BigInt(Math.pow(10, powTenPerWhole))]
            }
        }

        if (parts.length === 2) {
            const integralString = parts[0];
            const integral = Number.parseInt(integralString);

            let fractionalString = parts[1];
            // Trim the string if it exceeds the max number of decimals
            if (fractionalString.length > powTenPerWhole) {
                fractionalString = fractionalString.substr(0, powTenPerWhole);
            }
            const fractional = Number.parseInt(fractionalString);

            if (Number.isSafeInteger(integral) && Number.isSafeInteger(fractional)) {
                const total =
                    BigInt(integral) * BigInt(Math.pow(10, powTenPerWhole)) +
                    BigInt(fractional) * BigInt(Math.pow(10, powTenPerWhole - fractionalString.length));

                return [integralString + "." + fractionalString, total];
            }
        }
    }

    // If we reach here then the input is invalid
    return ["0", BigInt(0)];
}

export function format(units: bigint, minDecimals: number, powTenPerWhole: number): string {
    const unitsPerWhole = BigInt(Math.pow(10, powTenPerWhole));
    const integral = units / unitsPerWhole;
    const integralString = integral.toString();

    const fractional = units % unitsPerWhole;
    let fractionalString = fractional.toString().padStart(powTenPerWhole, "0");

    let countToTrim = 0;
    while (
        fractionalString.length - countToTrim > minDecimals &&
        fractionalString[fractionalString.length - 1 - countToTrim] === "0"
    ) {
        countToTrim++;
    }

    if (countToTrim > 0) {
        fractionalString = fractionalString.substr(0, fractionalString.length - countToTrim);
    }

    return fractionalString.length > 0 ? integralString + "." + fractionalString : integralString;
}


