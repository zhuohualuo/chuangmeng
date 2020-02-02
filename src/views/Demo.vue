<template>
    <div id="content">
        <el-row :gutter="16" class="row1">
            <el-col :span="6">
                <el-card class="box-card card1 clearfix" :body-style="{ padding: '15px 40px' }">
                    <div class='flex'>
                        <el-avatar
                        :size="64"
                        :src="require('@/assets/image/user_avatar.png')"
                        />
                        <div class='userInfo'>
                            <p>
                                {{ DONE_INDEX_DATA.user_name || "user" }}
                            </p>
                            <p>
                                {{ DONE_INDEX_DATA.email || "深圳市创梦天地科技有限公司" }}
                            </p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                 <el-card class="box-card card2" :body-style="{ padding: '18px 40px' }">
                     <div class='flex clearfix'>
                        <div>
                            <p>当前应用数</p>
                            <count-to :start-val="0"
                            class="current-number"
                            :end-val="DONE_INDEX_DATA.app_num||0"
                            :duration="3600"/>
                        </div>
                        <router-link :to="{path:'/putin/app/create'}">
                            <el-button  type="primary" size='small'  style="float: right;margin-top: 7px;">
                                <i class='mg-icon-plus font'></i>
                                新增应用</el-button>
                        </router-link>
                        </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                 <el-card class="box-card card2 green" :body-style="{ padding: '18px 40px' }">
                     <div class='flex clearfix'>
                        <div>
                            <p>当前子账户数</p>
                            <count-to :start-val="0"
                        class="current-number"
                        :end-val="DONE_INDEX_DATA.app_num||0"
                        :duration="3600"/>
                        </div>
                        <router-link :to="{path:'/user/subaccountdetail'}">
                        <el-button  type="primary" size='small'  style="float: right;margin-top: 7px;">
                            <i class='mg-icon-plus font'></i>
                            新增子账户</el-button>
                        </router-link>
                        </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                 <el-card class="box-card card2 yellow" :body-style="{ padding: '18px 40px' }">
                     <div class='flex'>
                        <div>
                            <p>当前子账户数</p>
                            <count-to :start-val="0"
                        class="current-number"
                        :end-val="DONE_INDEX_DATA.app_num||0"
                        :duration="3600"/>
                        </div>
                        <router-link :to="{path:'/user/agent'}">
                        <el-button  type="primary" size='small'  style="float: right;margin-top: 7px;">
                            <i class='mg-icon-plus font'></i>
                            新增代理商</el-button>
                        </router-link>
                        </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="row2">
            <el-card :body-style="{padding: '28px 40px'}">
                <div slot="header" class="top flex">
                    <span>数据概览</span>
                    <div class="selector">
                        <span class="selector-label mr24">日期</span>
                        <el-select
                            v-model="time"
                            filterable
                            placeholder="请选择时间"
                            size="small"
                            @change="onSearch"
                            style="width:380px"
                            >
                            <el-option
                                v-for="item in timeData"
                                :key="item.text"
                                :label="item.text"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="bottom flex">
                    <div v-for='item in dataList' :key="item.num" class='dataClass'>   
                        <div>{{item.text}}</div>
                        <div>{{item.num}}</div>
                        <i :class="`el-icon-${item.type}`"></i>
                        <div>{{`${item.trend}%`}}</div>
                    </div>
                </div>
            </el-card>
        </el-row>

        <el-row class="row3" :gutter="16">
            <el-col :span="12">
                <el-card>
                <div slot="header" class="top">
                    <div>媒体分布</div>
                    <div class='flex' >
                        <el-radio-group
                        v-model="dataRadio"
                        >
                            <el-radio-button label="cost" border>消耗 </el-radio-button>
                            <el-radio-button label="active"  border>激活</el-radio-button>
                            <el-radio-button label="register"  border>注册</el-radio-button>
                        </el-radio-group>
                        <div class="flex" style="align-items: normal;margin: 15px;">
                             <div class="selector">
                                <el-select
                                v-model="topValue"
                                @change="onSearchDis()"
                                size="small"
                                style="width:120px;flex:1;"
                                >
                                <el-option
                                    v-for="(item, index) in topList"
                                    :key="index"
                                    :label="item.text"
                                    :value="item.value"
                                />
                                </el-select>
                            </div>
                            <div class="selector">
                                <el-select
                                v-model="timeDis"
                                @change="onSearchDis()"
                                placeholder="请选择时间"
                                size="small"
                                style="width:120px;flex:1;"
                                >
                                <el-option
                                v-for="item in timeData"
                                :key="item.text"
                                :label="item.text"
                                :value="item.value"
                                ></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div> 
                 <div class="dis-body">
                    <div class="chart-container" id="dis-chart"></div>
                </div>
                </el-card>        
            </el-col>    
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import countTo from 'vue-count-to';
    import moment from 'moment';
    import echarts from "echarts";
    export default{
        components: { countTo },
        computed: {
            ...mapGetters(["DONE_INDEX_DATA"])
        },
        data() {
            return {
                time: '',
                dataRadio: '',
                timeData: [
                    // {text: '今天',value: [moment().format('YYYY-MM-DD'),moment().format('YYYY-MM-DD')]},
                    {text: '今天',value: this.getMomentTime(0,0,'days')},
                    {text: '昨天',value: this.getMomentTime(1,1,'days')},
                    {text: '近七天',value: this.getMomentTime(7,1,'days')},
                    {text: '近30天',value: this.getMomentTime(30,1,'days')},
                    {text: '本月',value: this.getMomentTime(0,0,'months')},
                    {text: '上月',value: this.getMomentTime(0,0,'monthsTop')},
                    {text: '本周',value: this.getMomentTime(0,0,'weekNow')},
                    {text: '上周',value: this.getMomentTime(0,0,'weekTop')},

                ],
                dataList: [
                    {
                        text: "总消耗",
                        name: "cost",
                        num: 0.00,
                        trend: null
                    },
                    {
                        text: "实际消耗",
                        name: "real_cost",
                        num: 0.00,
                        trend: null
                    },
                    {
                        text: "激活数",
                        name: "active",
                        num: 0,
                        trend: null
                    },
                    {
                        text: "激活成本",
                        name: "active_cost",
                        num: 0,
                        trend: null
                    },
                    {
                        text: "注册数",
                        name: "register",
                        num: 0,
                        trend: null
                    },
                    {
                        text: "注册成本",
                        name: "register_cost",
                        num: 0,
                        trend: null
                    },
                    {
                        text: "付费数",
                        name: "pay_count",
                        num: 0,
                        trend: null
                    },
                    {
                        text: "付费成本",
                        name: "pay_count_cost",
                        num: 0,
                        trend: null
                    }
                ],
                topList: [
                            {
                                text: "显示TOP5",
                                value: 5
                            }, {
                                text: "显示TOP10",
                                value: 10
                            }
                        ],
                timeDis: '',
                topValue: '',
                type: "cost",
                option: {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    color: ["#2FC25B", "#FACC14", "#1890FF", "#F04864", "#8543E0"],
                    legend: {
                        show: false,
                        orient: 'vertical',
                        left: 10,
                        data: ['广点通', '今日头条', '微信MP', '快手', '其他']
                    },
                    series: [
                        {
                        name: '123',
                        type: 'pie',
                        left: 'center',
                        top: 'middle',
                        minAngle: 5,
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: true,
                        label: {
                            formatter: '{b}: {c} ({d}%)',
                            emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                            }
                        },
                        labelLine: {
                            normal: {
                            show: true,
                            length: 21
                            }
                        },
                        data: [
                            {value: 160000, name: '今日头条', itemStyle: {color: "#FACC14"}},
                            {value: 250000, name: '广点通', itemStyle: {color: "#2FC25B"}},
                            {value: 100000, name: '微信MP', itemStyle: {color: "#1890FF"}},
                            {value: 50000, name: '快手', itemStyle: {color: "#F04864"}},
                            {value: 50000, name: '其他', itemStyle: {color: "#8543E0"}}
                        ]
                        }
                    ]
                },

            }
        },
        created() {
            this.$store.dispatch("FETCH_INDEX_DATA");
            this.time = this.timeData[0].value
            this.getDataList()
             window.addEventListener(
                "resize",
                this.orientation
            );
        },
        mouted() {
            let dom = document.getElementById('dis-chart');
            this.chart = echarts.init(dom);
            this.onSearchDis();
        },
        methods: {
            orientation() {
                this.chart.resize();
            },
            onSearchDis() {
                const [start_date, end_date] = this.timeDis;
                this.$store
                .dispatch("FETCH_PORTAL_TOP", {
                    top_num: this.topValue,
                    top_type: this.type,
                    start_date,
                    end_date
                })
                .then(res => {
                    // TODO :根据数据类型重组配置
                    this.responseData = res.list;
                    this.changeOption();
                });

            },
             changeOption() {
                let data = this.responseData;
                if (data.length > 0) {
                let legend = [];
                let series = [];
                for (let item of data) {
                    legend.push(item.media);
                    series.push({value: item[this.type], name: item[this.value.labelValue]});
                }
                this.option.legend.data = legend;
                this.option.series[0].data = series;
                this.chart.setOption(this.option);
                }

            },
            getMomentTime(start,end,key) {
                if(key === 'days') {
                    let value= []
                    let startTime= moment().subtract(start, "days").format("YYYY-MM-DD")
                    let endTime= moment().subtract(end, "days").format("YYYY-MM-DD")
                    value.push(startTime)
                    value.push(endTime)
                    return value
                }else if(key === 'months') {
                    let value= []
                    let startTime= moment().startOf('month').format('YYYY-MM-DD')
                    let endTime= moment().endOf('month').format('YYYY-MM-DD')
                    value.push(startTime)
                    value.push(endTime)
                    return value
                }else if(key === 'monthsTop') {
                    let date = []
                    let start = moment().subtract('month', 1).format('YYYY-MM') + '-01'
                    let end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
                    date.push(start)
                    date.push(end)
                    return date
                }
                else if(key === 'weekTop') {
                    let date = []
                    let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天  周日为一周中的第一天
                    let start = moment().subtract(weekOfday + 6, 'days').format('YYYY-MM-DD') // 周一日期
                    let end = moment().subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
                    date.push(start)
                    date.push(end)
                    return date
                }else if(key === 'weekNow') {
                    let date = []
                    let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
                    let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
                    let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
                    date.push(start)
                    date.push(end)
                    return date
                }
            },
            onSearch() {
                this.getData()
            },
            getDataList() {
                let [start_date, end_date] = this.time
                let params = {
                    start_date,
                    end_date
                }
                console.log("params",params)
                this.$axios.get('/Admin/Spm_Index/getMyDataSummary',{params}).then(result => {
                    if(result) {
                        let res = result.data
                        for(let item of this.dataList) {
                        item.num = res[item.name]
                        item.trend = (res[`${item.name}_per`]*100).toFixed(2)
                        if(typeof res[`${item.name}_per`] === 'number' && item.trend != null) {
                            if(item.trend > 0) {
                                item.type = 'top'
                            }else if(item.trend <0) {
                                item.type = 'bottom'
                            }else {
                                item.type = null
                            }
                        }
                    }
                    }
                })
            }
        }
    
    }
</script>

<style lang='scss' scoped>
    #content {
        padding: 20px 60px; 
    }
    .row1 {
        margin-bottom: 16px;
        .card1 {
            .userInfo {
                margin-left: 70px;
                p:nth-of-type(1) {
                    font-size: 18px;
                    font-weight: 700;  
                    margin-bottom: 5px;
                }
                p:nth-of-type(2) {
                    font-size: 11px;
                }
            }
        }
        .card2 {
            border-top: 4px solid blue;
            p {
                font-size: 14px;
                margin-bottom: 12px;
            }
            .yellow {
                border-top: 4px solid yellow;
            }
            .green {
                border-top: 4px solid green;
            }
            .current-number {
                font-weight: 500;
                font-size: 20px;
            }
            .el-button--primary {
                padding: 8px 20px;
            }
        }
    }

    .row2 {
        margin-bottom: 16px;
        .top {
            // margin-bottom: 24px;
            >span {
                font-size: 18px;
                font-weight: bold;
            }
            .selector-label {
                font-weight: bold;
            }
        }
        .bottom {
            .dataClass {
                padding: 0 30px;
                color: red; 
                div:nth-of-type(1) {
                    margin-bottom: 24px;
                    color: black;
                }
                div:nth-of-type(2) {
                    margin-bottom: 16px;
                    font-size: 16px;
                    color: black;
                    font-weight: bold;
                }
            }
        }
    }

    ::v-deep .row3 {
        .el-card__header {
            padding: 26px 41px 24px;
        }
        .el-radio-button__inner {
            padding: 8px 12px;
        }
    }
    .row3 {
        .el-card {
            .top {
                div:first-child {
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 27px;    
                }
                .selector {
                    margin: 0 4px;
                }
            }
            .chart-container {
                width: 100%;
                min-height: 310px;
            }
        }
    }
</style>