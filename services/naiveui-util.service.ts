const NaiveUtilService = {
  calcPageCount(totalPageNumber: number, pageSize: number): number {
    return Math.ceil(totalPageNumber / pageSize);
  },
  /**
   * page is the page number starting from 1. pageSize is the actual page size
   * skip will start the index from 0
   * @returns
   */
  convertToSkip(page: number, pageSize: number): number {
    let skip = (page - 1) * pageSize;
    return skip;
  },
};

export default NaiveUtilService;
