const map = {
  SUPERIOR: {
    name: 'Superior Dragon',
    color: '#eded02',
  },
  STRONG: {
    name: 'Strong Dragon',
    color: '#b01835',
  },
  UNSTABLE: {
    name: 'Unstable Dragon',
    color: '#7d0d9f',
  },
  WISE: {
    name: 'Wise Dragon',
    color: '#1da8a4',
  },
  YOUNG: {
    name: 'Young Dragon',
    color: '#9ba0a8',
  },
  OLD: {
    name: 'Old Dragon',
    color: '#a8a177',
  },
  PROTECTOR: {
    name: 'Protector Dragon',
    color: '#6b6a62',
  },
};

export default function find(dragonType) {
  if (dragonType in map) return map[dragonType];
  return { name: 'Unknown', color: '#000000' };
}
