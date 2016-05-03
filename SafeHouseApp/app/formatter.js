'use strict';

import I18n from './i18n';

let formatter = {
  capacity: (c) => {
    if(c === 1) {
      return `1 ${I18n.t('person')}`;
    }

    return `${c} ${I18n.t('people')}`;
  },

  duration: (d) => {
    switch(d) {
      case 2:
        return I18n.t('mediumTerm');
      case 3:
        return I18n.t('longTerm');
      default:
        return I18n.t('shortTerm');
    }
  },

  distance: (d) => {
    return Math.round(d * 10) / 10;
  }
};

export default formatter;

module.exports = formatter;
