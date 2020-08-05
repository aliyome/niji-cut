//@ts-ignore
import * as Compute from '@google-cloud/compute';
import * as functions from 'firebase-functions';

export const createVm = async (jobId: string) => {
  const compute = new Compute();
  const option = {
    kind: 'compute#instance',
    name: jobId,
    zone: 'projects/niji-cut/zones/asia-northeast1-b',
    machineType:
      'projects/niji-cut/zones/asia-northeast1-b/machineTypes/f1-micro',
    displayDevice: {
      enableDisplay: false,
    },
    metadata: {
      kind: 'compute#metadata',
      items: [
        {
          key: 'gce-container-declaration',
          value: `spec:\n  containers:\n    - name: ${jobId}\n      image: 'asia.gcr.io/niji-cut/node'\n      command:\n        - node\n      args:\n        - main.js\n        - ${jobId}\n      stdin: false\n      tty: false\n  restartPolicy: Never\n\n# This container declaration format is not public API and may change without notice. Please\n# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine.`,
        },
        {
          key: 'google-logging-enabled',
          value: 'true',
        },
        // {
        //   key: 'startup-script',
        //   value: '#! /bin/bash\ncd /root\nnode youtube.js',
        // },
      ],
    },
    tags: {
      items: ['http-server', 'https-server'],
    },
    disks: [
      {
        kind: 'compute#attachedDisk',
        type: 'PERSISTENT',
        boot: true,
        mode: 'READ_WRITE',
        autoDelete: true,
        deviceName: 'downloader-template-1',
        initializeParams: {
          sourceImage:
            'projects/cos-cloud/global/images/cos-stable-81-12871-181-0',
          diskType:
            'projects/niji-cut/zones/asia-northeast1-b/diskTypes/pd-standard',
          diskSizeGb: '20',
        },
        diskEncryptionKey: {},
      },
    ],
    canIpForward: false,
    networkInterfaces: [
      {
        kind: 'compute#networkInterface',
        subnetwork:
          'projects/niji-cut/regions/asia-northeast1/subnetworks/default',
        accessConfigs: [
          {
            kind: 'compute#accessConfig',
            name: 'External NAT',
            type: 'ONE_TO_ONE_NAT',
            networkTier: 'PREMIUM',
          },
        ],
        aliasIpRanges: [],
      },
    ],
    description: '',
    labels: {
      'container-vm': 'cos-stable-81-12871-181-0',
    },
    scheduling: {
      preemptible: true,
      onHostMaintenance: 'TERMINATE',
      automaticRestart: false,
      nodeAffinities: [],
    },
    deletionProtection: false,
    reservationAffinity: {
      consumeReservationType: 'ANY_RESERVATION',
    },
    serviceAccounts: [
      {
        email: '627670035930-compute@developer.gserviceaccount.com',
        scopes: [
          'https://www.googleapis.com/auth/compute',
          'https://www.googleapis.com/auth/devstorage.read_only',
          'https://www.googleapis.com/auth/logging.write',
          'https://www.googleapis.com/auth/monitoring.write',
          'https://www.googleapis.com/auth/servicecontrol',
          'https://www.googleapis.com/auth/service.management.readonly',
          'https://www.googleapis.com/auth/trace.append',
          'https://www.googleapis.com/auth/devstorage.full_control',
        ],
      },
    ],
    shieldedInstanceConfig: {
      enableSecureBoot: false,
      enableVtpm: true,
      enableIntegrityMonitoring: true,
    },
  };

  const zone = compute.zone('asia-northeast1-b');
  // @ts-ignore  vm使ってないけどよしとする
  const [vm, operation] = await zone.createVM(jobId, option);
  // console.log(vm);
  await operation.promise();
  functions.logger.log(jobId + ' created!');
};
