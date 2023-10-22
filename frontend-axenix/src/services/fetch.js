export const getForkliftersInWarhouse = async ({ warehouse_id }) => {
  const res = await fetch(
    `http://192.168.239.64:8080/forklifterlist?warehouse_id=${warehouse_id}`
  );
  const data = await res.json();
  return data;
};

export const getWarehouses = async () => {
  const res = await fetch(`http://192.168.239.64:8080/warehouse`)
  const data = await res.json();
  return data;
};

export const getForkliftData = async ({ id, warehouse_id }) => {
  const res = await fetch(
    `http://192.168.239.64:8080/forklifter?id=${id}&warehouse_id=${warehouse_id}`
  );
  const data = await res.json();
  return data;
};
