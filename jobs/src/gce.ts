//@ts-ignore
import * as Compute from '@google-cloud/compute';

export const deleteAll = async () => {
  const compute = new Compute();
  const [vms] = await compute.getVMs();
  const vmNames = vms.map((vm: any) => vm.name);
  console.log(vmNames);
  for (const name of vmNames) {
    await deleteVm(name);
  }
  console.log('delete all vms!');
};

export const deleteVm = async (vmName: string) => {
  const compute = new Compute();
  const zone = compute.zone('asia-northeast1-b');
  const vm = await zone.vm(vmName);
  const [operation] = await vm.delete();
  await operation.promise();
  console.log(vmName + ' deleted!');
};
