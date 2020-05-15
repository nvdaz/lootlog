const map = {
  SUPERIOR_FRAGMENT: {
    name: 'Superior Fragment',
    color: '#eded02',
  },
  STRONG_FRAGMENT: {
    name: 'Strong Fragment',
    color: '#b01835',
  },
  UNSTABLE_FRAGMENT: {
    name: 'Unstable Fragment',
    color: '#7d0d9f',
  },
  WISE_FRAGMENT: {
    name: 'Wise Fragment',
    color: '#1da8a4',
  },
  YOUNG_FRAGMENT: {
    name: 'Young Fragment',
    color: '#9ba0a8',
  },
  OLD_FRAGMENT: {
    name: 'Old Fragment',
    color: '#a8a177',
  },
  PROTECTOR_FRAGMENT: {
    name: 'Protector Fragment',
    color: '#6b6a62',
  },
};

export default function find(item) {
  if (item in map) return map[item];
  return { name: 'Unknown', color: '#000000' };
}
