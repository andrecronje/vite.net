import { get, post } from "../api/axios";

const PREFIX = "transaction";

export default {

  /**
   * get accountchain blocklist
   *
   * @param {Object} {
   *   index,  -- from the beginning of the page，start from 0.
   *   num, -- take a few pages, take 1 by default
   *   count = 10 -- how many Block are taken per page. The default is 10.
   * }
   * @param {*} accountAddress -- optional, account address
   * @param {*} tokenId
   * @returns {Promise}
   */
  getList({
    pageIndex,
    pageSize = 10,
    pageNum
  }, accountAddress, tokenId) {
    return post(`${PREFIX}/list`, {
      paging: {
        index: pageIndex,
        count: pageSize,
        num: pageNum
      },
      accountAddress,
      tokenId
    });
  },

  // get accountchain block
  getDetail({blockHash}) {
    return get(`${PREFIX}/detail`, {
      blockHash
    });
  }
};
