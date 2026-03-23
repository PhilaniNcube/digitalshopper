const formatter = (value:number) => {
// format value as a currency
    return value.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });


}

export default formatter;
