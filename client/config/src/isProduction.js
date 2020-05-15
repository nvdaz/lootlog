import yargs from 'yargs';

export default (yargs.argv.mode || 'production') === 'production';