const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const orderID = searchParams["order"]
    ? searchParams["order"]
    : "";

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/orders/confirm?order=${orderID}`;

    const orderResponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }).then((res) => {
      if(!res.ok) {
        throw new Error(`Network response was not ok (${res.status})`);
      }
      return res.json();
    }).then(data => {
      console.log(data);
      return data;
    }).catch((error) => console.log(error));

    console.log(orderResponse)



  return <div>{JSON.stringify(orderResponse, null, 2)}</div>;
};
export default page;
