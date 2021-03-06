<template>
  <page-tabel :pagination="pagination"
    :loading="loading"
    :title="'总交易笔数----'"
    :tabelTitles="transactionsTitles"
    :tabelData="transactionsData"
    :current-change="fetchTransList"
    :currentPage="pageIndex"
    :total="0">
  </page-tabel>
</template>

<script>
  import pageTable from "~/components/pageTable";
  import transaction from "~/services/transaction.js";

  export default {
    props: {
      pagination: {
        type: Boolean,
        default: true
      },
      tokenTitle: {
        type: Boolean,
        default: true
      },
      accountAddress: {
        type: String,
        default: ""
      },
      tokenId: {
        type: String,
        default: ""
      },
      transactions: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    components: {
      pageTable
    },
    mounted() {
      this.fetchTransList();
    },
    data() {
      return {
        transactionList: this.transactions,
        pageIndex: 0,
        loading: false
      };
    },
    computed: {
      transactionsTitles() {
        let titles = [{
          prop: "hash",
          name: "交易Hash"
        }, {
          prop: "type",
          name: "交易类型"
        }, {
          prop: "status",
          name: "状态"
        },{
          prop: "snapshotTimestamp",
          name: "首次快照块"
        }, {
          prop: "timestamp",
          name: "时间戳"
        }, {
          prop: "confirmTimes",
          name: "确认数"
        }, {
          prop: "from",
          name: "转出方"
        }, {
          prop: "to",
          name: "转入方"
        }];
        this.tokenTitle && titles.push({
          prop: "tokenName",
          name: "Token"
        });
        titles.push({
          prop: "amount",
          name: "金额"
        });
        return titles;
      },
      transactionsData() {
        if (!this.transactionList) {
          return [];
        }
        let list = [];
        this.transactionList.forEach((transaction) => {
          list.push({
            hash: `<a href="/transaction/${transaction.hash}">${transaction.hash}</a>`,
            timestamp: `<a href="/block/${transaction.timestamp}">${transaction.timestamp}</a>`,
            snapshotTimestamp: `<a href="/block/${transaction.snapshotTimestamp}">${transaction.snapshotTimestamp}</a>`,
            to: `<a href="/account/${transaction.to}">${transaction.to}</a>`,
            from: `<a href="/account/${transaction.from}">${transaction.from}</a>`,
            type: transaction.fromHash ? "发送" : "接收",
            amount: transaction.fromHash ? `-${transaction.amount}` : transaction.amount,
            status: ["unkown", "open", "closed"][transaction.status],
            confirmTimes: transaction.confirmTimes,
            tokenName: transaction.tokenName
          });
        });
        return list;
      }
    },
    watch: {
      tokenId() {
        this.fetchTransList();
      },
      accountAddress() {
        this.fetchTransList();
      }
    },
    methods: {
      isRightRequest(currentIndex, accountAddress, tokenId) {
        if (this.pageIndex !== currentIndex ||
            this.tokenId !== tokenId ||
            this.accountAddress !== accountAddress) {
          return false;
        }
        return true;
      },
      fetchTransList(currentIndex = 0) {
        this.loading = true;
        this.pageIndex = currentIndex;
        let tokenId = this.tokenId;
        let accountAddress = this.accountAddress;

        transaction.getList({
          pageIndex: 0,
          pageSize: 6
        }, accountAddress, tokenId).then(({ transactionList }) => {
          if (!this.isRightRequest(currentIndex, accountAddress, tokenId)) {
            return;
          }
          this.loading = false;
          this.transactionList = transactionList;
        }).catch((err) => {
          if (!this.isRightRequest(currentIndex, accountAddress, tokenId)) {
            return;
          }
          this.loading = false;
          this.$message.error(err.msg || "get transList fail");
        });
      }
    }
  };
</script>
