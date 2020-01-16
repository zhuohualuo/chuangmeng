<template>
  <div class="AdDetail" :style="`right: ${visible ? 0 : -750}px;`">
    <div class="DetailTitle">
      <span>计划诊断详情</span>
      <div @click="handleClose" class="DetailCloseBtn">✕</div>
    </div>
    <div class="DetailBasic">
      <div class="DetailBasicTitle">计划基本信息</div>
      <table class="DetailTable">
        <tr>
          <td class="Label">计划名称：</td>
          <td class="Value">{{ data.ad_name }}</td>
        </tr>
        <tr>
          <td class="Label">计划ID：</td>
          <td class="Value">{{ data.campaign_id }}</td>
        </tr>
        <tr>
          <td class="Label">当前出价(元)：</td>
          <td class="Value">{{ data.bid }}</td>
        </tr>
        <tr>
          <td class="Label">计划预算(元)：</td>
          <td class="Value">{{ data.budget }}</td>
        </tr>
      </table>
    </div>
    <div class="DetailAdv">
      <div class="DetailAdvTitle">诊断报告</div>
      <table class="DetailTable">
        <tr>
          <td class="Label">时间范围：</td>
          <td class="Value">{{ data.time_range }}</td>
        </tr>
        <tr>
          <td class="Label">诊断评分：</td>
          <td class="Value">
            <svg
              v-for="(color, index) in rankWithStars(data.severity)"
              :key="color + index"
              style="height:12px;width:12px;vertical-align:middle"
            >
              <g
                :style="
                  `fill-rule:nonzero;${
                    color
                      ? 'fill:' + color
                      : 'stroke:#d5d1d1;stroke-width:1.00157481;fill:none'
                  }`
                "
              >
                <path
                  d="m 6.2548793,0.2803176 1.4005738,2.8154706 c 0.074332,0.1487651 0.216476,0.2508105 0.3807892,0.2753998 L 11.16732,3.8224009 c 0.414695,0.060244 0.581616,0.5667826 0.280376,0.8569359 L 9.1825219,6.8714696 C 9.0625472,6.9870391 9.0090803,7.1530166 9.0364658,7.3165352 l 0.5346697,3.0945588 c 0.07042,0.410641 -0.3638362,0.722924 -0.7341928,0.529899 L 6.0357952,9.4791609 c -0.1473602,-0.077456 -0.32341,-0.077456 -0.4707702,0 L 2.7638775,10.940993 C 2.3922168,11.135248 1.9579607,10.821735 2.0296847,10.411094 L 2.5643544,7.3165352 C 2.593044,7.1530166 2.5382729,6.9870391 2.4182983,6.8714696 L 0.15312448,4.6793368 C -0.14681218,4.3891835 0.01880502,3.8826446 0.43350005,3.8224009 L 3.5645779,3.371188 C 3.7288911,3.3478282 3.872339,3.2445533 3.9453671,3.0957882 L 5.3459408,0.2803176 c 0.1864824,-0.3737568 0.7237602,-0.3737568 0.9089385,0 z"
                ></path>
              </g>
            </svg>
            <span>{{ rank(data.severity) }}</span>
          </td>
        </tr>
        <tr>
          <td class="Label">诊断报告：</td>
          <td class="Value">{{ data.conclusion }}</td>
        </tr>
      </table>

      <div v-if="getPaths" class="FunnelSection">
        <div class="DetailTitleRit">投放漏斗</div>
        <div class="DetailHintRit">
          投放漏斗披露了您的一条广告在投放时和众多其他广告竞争的通过率
        </div>
        <svg width="250" height="200">
          <path :d="getPaths[0]" fill="#CADDF8"></path>
          <path :d="getPaths[1]" fill="#BAD2F5"></path>
          <path d="M0 100 L200 100" stroke="#F5F4F3" stroke-width="1"></path>
          <path :d="getPaths[2]" stroke="#F5F4F3" stroke-width="2"></path>
          <rect
            x="0.5"
            y="0.5"
            width="199"
            height="199"
            fill="none"
            stroke="#F5F4F3"
            stroke-width="1"
          ></rect>
          <path d="M100 50 L250 50" stroke="#ccc" stroke-dasharray="4"></path>
          <path d="M100 150 L250 150" stroke="#ccc" stroke-dasharray="4"></path>
        </svg>
        <div class="FunnelSection1">
          <div class="FunnelSectionTitle">
            <span
              >定向阶段：通过率
              {{ (data.funnel_data.target.aim * 100).toFixed(2) }}% </span
            ><span>{{ rankFunnel(data.funnel_data.target.sort_rank) }}</span
            ><span
              >，同行业竞争计划：{{
                (data.funnel_data.target.bench * 100).toFixed(2)
              }}%</span
            >
          </div>
          <div class="FunnelSectionHint">
            <span
              >您的定向、预算设置会影响此阶段表现；您可查看对应诊断模块了解更多详细数据</span
            >
          </div>
        </div>
        <div class="FunnelSection2">
          <div class="FunnelSectionTitle">
            <span
              >竞价阶段：通过率
              {{ (data.funnel_data.rank.aim * 100).toFixed(2) }}% </span
            ><span>{{ rankFunnel(data.funnel_data.rank.sort_rank) }}</span
            ><span
              >，同行业竞争计划：{{
                (data.funnel_data.rank.bench * 100).toFixed(2)
              }}%</span
            >
          </div>
          <div class="FunnelSectionHint">
            <span>影响此阶段的指标的因素包括</span
            ><a @click="handlePosition('creativeVisible', 'creativeSection')"
              >点击获取能力、</a
            ><a @click="handlePosition('landingVisible', 'landingSection')"
              >转化获取能力、</a
            ><a @click="handlePosition('bidVisible', 'bidSection')"
              >出价竞争力</a
            ><span>，您可查看对应诊断模块了解单个影响因素详细数据及建议</span>
          </div>
        </div>
      </div>

      <div class="DetailTitleRit">诊断详情</div>

      <div id="ecpmSection" class="DetailSection">
        <div @click="ecpmVisible = !ecpmVisible" class="DetailSectionTitle">
          <span class="Content">竞争环境诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>竞争环境诊断</h1>
              <p>
                竞争环境诊断是指最近与您竞争的广告整体水平，以及您的广告在其中的位置，您可参考竞争环境变化来确定您的优化方向
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span
            :style="`color: ${rankWithColor(data.attributions.ecpm.severity)};`"
            >{{ rank(data.attributions.ecpm.severity) }}</span
          ><span class="DetailSectionArrow">
            {{ ecpmVisible ? "▼" : "▲" }}</span
          >
        </div>

        <div v-show="ecpmVisible" class="DetailSectionContent">
          <div class="DetailSectionConclusion">
            {{ data.attributions.ecpm.conclusion }}
          </div>
          <div class="DetailSectionRitBlocksTitle">平台ECPM诊断：</div>
          <div class="DetailSectionRitBlock">
            <div class="DetailSectionRitBlockTitle">抖音信息流</div>
            <div class="DetailSectionRitBlockBody">
              <span>{{ data.attributions.ecpm.card_conclusion }}</span>
              <svg
                v-if="data.attributions.ecpm.card_conclusion === '偏低'"
                width="10px"
                height="10px"
                viewBox="0 0 10 10"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <rect id="path-1" x="0" y="0" width="10" height="10"></rect>
                </defs>
                <g
                  id="箭头-偏低"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="Combined-Shape">
                    <mask id="mask-2" fill="white">
                      <use xlink:href="#path-1"></use>
                    </mask>
                    <g id="Mask"></g>
                    <path
                      d="M2.96446609,7.01923714 L7.78641129,7.01923714 C8.20014028,7.01923714 8.53553391,7.35213576 8.53553391,7.76923714 C8.53553391,8.1834507 8.19790936,8.51923714 7.78641129,8.51923714 L2.28465653,8.51923714 C2.05586953,8.51923714 1.85103711,8.41743832 1.71362809,8.25589539 C1.56067725,8.11841361 1.46446609,7.91931346 1.46446609,7.69904671 L1.46446609,2.19729195 C1.46446609,1.78356295 1.79736471,1.44816933 2.21446609,1.44816933 C2.62867966,1.44816933 2.96446609,1.78579388 2.96446609,2.19729195 L2.96446609,7.01923714 Z"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      transform="translate(5.000000, 4.983703) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -4.983703) "
                    ></path>
                    <rect
                      id="Rectangle-2"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      x="4.30000019"
                      y="0"
                      width="1.5"
                      height="9"
                      rx="0.75"
                    ></rect>
                  </g>
                </g>
              </svg>
              <svg
                v-else-if="data.attributions.ecpm.card_conclusion === '正常'"
                width="10px"
                height="10px"
                viewBox="0 0 10 2"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g
                  id="Symbols"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="正常" fill="#59C623">
                    <rect
                      id="Rectangle-2"
                      x="0"
                      y="0"
                      width="10"
                      height="2"
                      rx="1"
                    ></rect>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div class="DetailSectionRitBlocksTitle">流量回放：</div>
          <!-- <ul class="ButtonGroup">
            <li data-index="0"
              class="EnabledBtn">竞争力排名趋势</li>
            <li data-index="1"
              class="DisabledBtn">展示量预估趋势</li>
          </ul> -->
          <div class="EcpmChart"></div>
          <!-- <div class="DetailSectionRitBlocksTitle">其他行业竞争对手分布（排名前五）：</div>
          <table class="EcpmTable">
            <thead>
              <tr>
                <th>行业</th>
                <th><span>竞价成功占比</span>
                  <div class="QuestionMark"><span><svg xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path>
                      </svg></span>
                    <div class="Message">
                      <h1>竞价成功占比</h1>
                      <p>竞价成功占比最近2小时该行业获得竞价成功的次数，占所有竞价请求次数的比例</p>
                    </div>
                    <div class="Arrow"></div>
                    <div class="ArrowBorder"></div>
                  </div>
                </th>
                <th>ECPM均值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>金融保险</td>
                <td>47.39%</td>
                <td>61.43</td>
              </tr>
              <tr>
                <td>应用下载</td>
                <td>45.72%</td>
                <td>46.07</td>
              </tr>
              <tr>
                <td>文化娱乐</td>
                <td>6.88%</td>
                <td>42.47</td>
              </tr>
            </tbody>
          </table> -->
        </div>
      </div>

      <div class="DetailSection">
        <div @click="bidVisible = !bidVisible" class="DetailSectionTitle">
          <span class="Content">出价竞争力诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>出价竞争力</h1>
              <p>
                出价竞争力是指在相竞争的计划中出价是否有优势，提高出价可以快速提高竞争力
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span
            :style="`color: ${rankWithColor(data.attributions.bid.severity)};`"
            >{{ rank(data.attributions.bid.severity) }}</span
          ><span class="DetailSectionArrow">{{ bidVisible ? "▼" : "▲" }}</span>
        </div>
        <div v-show="bidVisible" id="bidSection" class="DetailSectionContent">
          <div class="DetailSectionConclusion">
            {{ data.attributions.bid.conclusion }}
          </div>
          <div class="DetailSectionRitBlocksTitle">平台出价诊断：</div>
          <div class="DetailSectionRitBlock">
            <div class="DetailSectionRitBlockTitle">抖音信息流</div>
            <div class="DetailSectionRitBlockBody">
              <span>{{ data.attributions.bid.card_conclusion }}</span>
              <svg
                v-if="data.attributions.bid.card_conclusion === '偏低'"
                width="10px"
                height="10px"
                viewBox="0 0 10 10"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <rect id="path-1" x="0" y="0" width="10" height="10"></rect>
                </defs>
                <g
                  id="箭头-偏低"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="Combined-Shape">
                    <mask id="mask-2" fill="white">
                      <use xlink:href="#path-1"></use>
                    </mask>
                    <g id="Mask"></g>
                    <path
                      d="M2.96446609,7.01923714 L7.78641129,7.01923714 C8.20014028,7.01923714 8.53553391,7.35213576 8.53553391,7.76923714 C8.53553391,8.1834507 8.19790936,8.51923714 7.78641129,8.51923714 L2.28465653,8.51923714 C2.05586953,8.51923714 1.85103711,8.41743832 1.71362809,8.25589539 C1.56067725,8.11841361 1.46446609,7.91931346 1.46446609,7.69904671 L1.46446609,2.19729195 C1.46446609,1.78356295 1.79736471,1.44816933 2.21446609,1.44816933 C2.62867966,1.44816933 2.96446609,1.78579388 2.96446609,2.19729195 L2.96446609,7.01923714 Z"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      transform="translate(5.000000, 4.983703) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -4.983703) "
                    ></path>
                    <rect
                      id="Rectangle-2"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      x="4.30000019"
                      y="0"
                      width="1.5"
                      height="9"
                      rx="0.75"
                    ></rect>
                  </g>
                </g>
              </svg>
              <svg
                v-else-if="data.attributions.bid.card_conclusion === '正常'"
                width="10px"
                height="10px"
                viewBox="0 0 10 2"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g
                  id="Symbols"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="正常" fill="#59C623">
                    <rect
                      id="Rectangle-2"
                      x="0"
                      y="0"
                      width="10"
                      height="2"
                      rx="1"
                    ></rect>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div class="DetailSectionRitBlocksTitle">出价趋势：</div>
          <div class="CurveChart"></div>
          <div class="DetailSectionRitBlocksTitle">
            <span>出价优化建议：</span
            ><span style="color: rgb(153, 153, 153); font-size: 12px;"
              >（预估展示量为修改后2~4小时内的提升）</span
            >
          </div>
          <table class="FutureStarTable">
            <thead>
              <tr>
                <th>调价比例</th>
                <th>建议出价</th>
                <th>预估展示提升</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(bid, index) in data.attributions.bid.future_star_rates
                  .bid_list"
                :key="bid"
              >
                <td>
                  {{
                    (
                      data.attributions.bid.future_star_rates.rate_list[index] *
                      100
                    ).toFixed(2)
                  }}%
                </td>
                <td>{{ bid }}</td>
                <td>
                  {{
                    (
                      data.attributions.bid.future_star_rates.cost_list[index] *
                      100
                    ).toFixed(2)
                  }}%
                </td>
                <td @click="handleUpdateBid(bid.toString())" class="Link">
                  修改为此出价
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="bidParams.visible" class="DetailSectionOperation">
            <span class="DetailSectionOperationLabel"
              >当前出价为 {{ data.bid }} 元，修改出价为
            </span>
            <div class="TextInput">
              <input v-model="bidParams.bid" placeholder="" class="Input" />
            </div>

            <span>元</span>
            <div
              @click="handleUpdateBid(bidParams.bid)"
              class="DetailSectionOperationBtn"
            >
              确认
            </div>
          </div>
          <div v-else class="DetailSectionOperation">
            <span>已将出价修改为 {{ data.bid }} 元</span>
            <div @click="bidParams.visible = true" class="Link">重新修改</div>
          </div>
        </div>
      </div>

      <div class="DetailSection">
        <div @click="budgetVisible = !budgetVisible" class="DetailSectionTitle">
          <span class="Content">预算充足度诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>预算充足度</h1>
              <p>
                预算充足度是受计划投放的实际的可用预算影响，是计划预算、组预算、账户余额的三者最小值；
                预算接近会导致系统对投放速度进行降速，影响投放
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span :style="`color: ${getBudgetTitle.color}`">{{
            getBudgetTitle.label
          }}</span
          ><span class="DetailSectionArrow">
            {{ budgetVisible ? "▼" : "▲" }}</span
          >
        </div>

        <div v-show="budgetVisible" class="DetailSectionContent">
          <div class="DetailSectionConclusion">{{ getBudgetConclusion }}</div>
          <table class="DetailTable">
            <tr>
              <td class="Label">计划消耗/预算：</td>
              <td class="Value">{{ data.cost }} / {{ data.budget }} 元</td>
            </tr>
            <tr>
              <td class="Label">账户实时余额：</td>
              <td class="Value">
                <span>{{ data.balance }} 元</span>
              </td>
            </tr>
          </table>

          <div v-if="budgetParams.visible" class="DetailSectionOperation">
            <span class="DetailSectionOperationLabel"
              >当前预算为 {{ data.budget }} 元，修改预算为
            </span>
            <div class="TextInput">
              <input v-model="budgetParams.budget" class="Input" />
            </div>
            <span>元</span>
            <div @click="handleUpdateBudget" class="DetailSectionOperationBtn">
              确认
            </div>
          </div>
          <div v-else class="DetailSectionOperation">
            <span>已将预算修改为 {{ data.budget }} 元</span>
            <div @click="budgetParams.visible = true" class="Link">
              重新修改
            </div>
          </div>
        </div>
      </div>

      <div id="targetSection" class="DetailSection">
        <div @click="targetVisible = !targetVisible" class="DetailSectionTitle">
          <span class="Content">定向质量度诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>定向质量度</h1>
              <p>
                定向的质量是根据所选择人群的数量，对于推广计划的兴趣程度，以及所选人群的竞争激烈程度三个因素综合考虑计算所得，得分过低表示定向设置不合理，会很大程度上影响投放，建议优化定向设置
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span
            :style="`color: ${rankTargetWithColor(data.target_quality)};`"
            >{{ rankTarget(data.target_quality) }}</span
          ><span class="DetailSectionArrow">
            {{ targetVisible ? "▼" : "▲" }}</span
          >
        </div>

        <div v-show="targetVisible" class="DetailSectionContent">
          <div class="DetailSectionTargetBlockTitle">
            <span>覆盖度</span>
            <div class="QuestionMark">
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  ></path></svg
              ></span>
              <div class="Message">
                <h1>覆盖度</h1>
                <p>
                  覆盖度表示该计划覆盖的用户量是否充足，覆盖度过低很可能会影响展示量；覆盖度的计算方式是与同行业相竞争的计划比较人群覆盖量，根据排名占比得出对应得分。覆盖度得分低说明定向限制过多，覆盖人群量不及同行业其他计划
                </p>
              </div>
              <div class="Arrow"></div>
              <div class="ArrowBorder"></div>
            </div>
            <span
              v-for="(color, index) in rankTargetBlocks(
                data.target_quality.aud_num
              )"
              :key="color + index"
              :class="color"
            ></span>
          </div>
          <div class="DetailSectionTargetBlockNote">
            可以通过开放定向限制，增加覆盖受众优化
          </div>
          <div class="DetailSectionTargetBlockTitle">
            <span>精准度</span>
            <div class="QuestionMark">
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  ></path></svg
              ></span>
              <div class="Message">
                <h1>精准度</h1>
                <p>
                  精准度表示该计划所选择的人群对该行业的兴趣程度(主要表现在点击率)；精准度的计算方式是用该定向设置对应的平均点击率，比对同行业其他计划的定向设置，根据排名得出对应分数。精准度得分低说明定向设置与该行业优质人群有一定偏差
                </p>
              </div>
              <div class="Arrow"></div>
              <div class="ArrowBorder"></div>
            </div>
            <span
              v-for="(color, index) in rankTargetBlocks(
                data.target_quality.precision
              )"
              :key="color + index"
              :class="color"
            ></span>
          </div>
          <div class="DetailSectionTargetBlockNote">
            可以通过精选定向优化，如系统推荐定向，DMP行业人群包等方式优化
          </div>
          <div class="DetailSectionTargetBlockTitle">
            <span>蓝海度</span>
            <div class="QuestionMark">
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  ></path></svg
              ></span>
              <div class="Message">
                <h1>蓝海度</h1>
                <p>
                  蓝海度表示该计划所选择人群的竞争激烈程度，蓝海度越低表示竞争越激烈，需要更高的出价和更优质的素材来竞争；蓝海度的计算方式是用该定向设置对应人群的竞争情况计算而得，根据排名得出对应分数
                </p>
              </div>
              <div class="Arrow"></div>
              <div class="ArrowBorder"></div>
            </div>
            <span
              v-for="(color, index) in rankTargetBlocks(
                data.target_quality.blueocean
              )"
              :key="color + index"
              :class="color"
            ></span>
          </div>
          <div class="DetailSectionTargetBlockNote">
            可以通过选择冷门走向，如系统推荐定向，DMP行业人群包等方式优化
          </div>
          <div class="DetailSectionCtrCvrTitle">定向优化总结</div>
          <ol v-if="targetExpand" class="DetailSectionCtrCvrLinks">
            <li>
              投放初期以精准度优先，找到最容易点击和转化的人群，降低探索成本，可以选择【系统推荐定向】功能，【DMP定向人群包】功能，或根据历史投放经验选择定向
            </li>
            <li>
              计划达到一定投放量后，尽量保证覆盖度，可以探索更多人群，延长计划投放周期
            </li>
            <li>
              定向蓝海度较低时，说明所选定向竞争比较激烈，建议优化定向或提高出价
            </li>
          </ol>
          <div
            @click="targetExpand = !targetExpand"
            class="DetailSectionCtrCvrShowAllBtn"
          >
            <i
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  :d="
                    targetExpand
                      ? 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
                      : 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
                  "
                ></path></svg></i
            ><span>{{ targetExpand ? "收起详情" : "展开查看详情" }}</span>
          </div>
          <div class="DetailSectionOperation">
            <div data-json="null" class="Button">
              <div class="Prefix"></div>
              <router-link
                :to="{
                  path: '/idt/ad/edit',
                  query: {
                    idt_id: data.idt_id,
                    ad_id: data.ad_id,
                    campaign_id: data.campaign_id,
                    landing_type: data.landing_type,
                    isGroup: false
                  }
                }"
                target="_blank"
                >前往修改定向</router-link
              >

              <div class="Suffix"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="creativeSection" class="DetailSection">
        <div
          @click="creativeVisible = !creativeVisible"
          class="DetailSectionTitle"
        >
          <span class="Content">点击获取能力诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>点击获取能力</h1>
              <p>
                点击获取能力同时受到创意质量，历史投放记录，定向选择，出价等影响，其中创意质量是最主要影响因素：
                建议优化创意以提高点击获取能力
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span
            :style="
              `color: ${rankWithColor(data.attributions.budget.severity)};`
            "
            >{{ rank(data.attributions.budget.severity) }}</span
          ><span class="DetailSectionArrow">
            {{ creativeVisible ? "▼" : "▲" }}</span
          >
        </div>

        <div v-show="creativeVisible" class="DetailSectionContent">
          <div class="DetailSectionConclusion">
            {{ data.attributions.creative.conclusion }}
          </div>
          <div class="DetailSectionRitBlocksTitle">平台实时预估点击率：</div>
          <div class="DetailSectionRitBlock">
            <div class="DetailSectionRitBlockTitle">
              抖音信息流（{{ data.attributions.creative.card_conclusion }}）
            </div>
            <div class="DetailSectionRitBlockBody">
              <span>{{ data.attributions.creative.cell_value }}</span>
              <svg
                v-if="data.attributions.creative.card_conclusion === '偏低'"
                width="10px"
                height="10px"
                viewBox="0 0 10 10"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <rect id="path-1" x="0" y="0" width="10" height="10"></rect>
                </defs>
                <g
                  id="箭头-偏低"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="Combined-Shape">
                    <mask id="mask-2" fill="white">
                      <use xlink:href="#path-1"></use>
                    </mask>
                    <g id="Mask"></g>
                    <path
                      d="M2.96446609,7.01923714 L7.78641129,7.01923714 C8.20014028,7.01923714 8.53553391,7.35213576 8.53553391,7.76923714 C8.53553391,8.1834507 8.19790936,8.51923714 7.78641129,8.51923714 L2.28465653,8.51923714 C2.05586953,8.51923714 1.85103711,8.41743832 1.71362809,8.25589539 C1.56067725,8.11841361 1.46446609,7.91931346 1.46446609,7.69904671 L1.46446609,2.19729195 C1.46446609,1.78356295 1.79736471,1.44816933 2.21446609,1.44816933 C2.62867966,1.44816933 2.96446609,1.78579388 2.96446609,2.19729195 L2.96446609,7.01923714 Z"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      transform="translate(5.000000, 4.983703) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -4.983703) "
                    ></path>
                    <rect
                      id="Rectangle-2"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      x="4.30000019"
                      y="0"
                      width="1.5"
                      height="9"
                      rx="0.75"
                    ></rect>
                  </g>
                </g>
              </svg>
              <svg
                v-else-if="data.attributions.budget.card_conclusion === '正常'"
                width="10px"
                height="10px"
                viewBox="0 0 10 2"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g
                  id="Symbols"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="正常" fill="#59C623">
                    <rect
                      id="Rectangle-2"
                      x="0"
                      y="0"
                      width="10"
                      height="2"
                      rx="1"
                    ></rect>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div class="DetailSectionRitBlocksTitle">预估点击率：</div>
          <div class="CurveChart"></div>
          <div class="DetailSectionCtrCvrTitle">创意优化总结</div>
          <ol v-if="creativeExpand" class="DetailSectionCtrCvrLinks">
            <li>请检查您的创意数量，建议创意数量在5个以上</li>
            <li>请检查图片/视频是否清晰</li>
            <li>请检查图片/视频颜色是否超过5种</li>
            <li>请检查图片/视频中是否包含过多文字</li>
          </ol>
          <div
            @click="creativeExpand = !creativeExpand"
            class="DetailSectionCtrCvrShowAllBtn"
          >
            <i
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  :d="
                    creativeExpand
                      ? 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
                      : 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
                  "
                ></path></svg></i
            ><span>{{ creativeExpand ? "收起详情" : "展开查看详情" }}</span>
          </div>
          <!-- <div class="DetailSectionCtrCvrTitle">标题建议</div>
          <ol class="DetailSectionCtrCvrLinks">
            <li><input type="text"
                class="RecommendTitle"><a class="Link FloatRight">复制</a></li>
            <li><input type="text"
                class="RecommendTitle"><a class="Link FloatRight">复制</a></li>
            <li><input type="text"
                class="RecommendTitle"><a class="Link FloatRight">复制</a></li>
            <li><input type="text"
                class="RecommendTitle"><a class="Link FloatRight">复制</a></li>
            <li><input type="text"
                class="RecommendTitle"><a class="Link FloatRight">复制</a></li>
          </ol>
          <div class="DetailSectionCtrCvrShowAllBtn"><span>换一批</span></div> -->
          <div class="DetailSectionOperation">
            <div data-json="null" class="Button">
              <div class="Prefix"></div>
              <router-link
                :to="{
                  path: '/idt/creative/detail',
                  query: {
                    idt_id: data.idt_id,
                    ad_id: data.ad_id,
                    campaign_id: data.campaign_id,
                    opt: 'edit'
                  }
                }"
                target="_blank"
                >前往修改创意</router-link
              >
              <div class="Suffix"></div>
            </div>
          </div>
        </div>
      </div>

      <div id="landingSection" class="DetailSection">
        <div
          @click="landingVisible = !landingVisible"
          class="DetailSectionTitle"
        >
          <span class="Content">转化获取能力诊断</span>
          <div class="QuestionMark">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                ></path></svg
            ></span>
            <div class="Message">
              <h1>转化获取能力</h1>
              <p>
                转化获取能力同时受到落地页质量，落地页和创意相关性，历史投放记录，定向选择，出价等影响，其中落地页质量是最主要影响因素：
                建议优化落地页以提高点击获取能力
              </p>
            </div>
            <div class="Arrow"></div>
            <div class="ArrowBorder"></div>
          </div>
          <span
            :style="
              `color: ${rankWithColor(
                data.attributions.loading_page.severity
              )};`
            "
            >{{ rank(data.attributions.loading_page.severity) }}</span
          ><span class="DetailSectionArrow">{{
            landingVisible ? "▼" : "▲"
          }}</span>
        </div>

        <div v-show="landingVisible" class="DetailSectionContent">
          <div class="DetailSectionConclusion">
            {{ data.attributions.loading_page.conclusion }}
          </div>
          <div class="DetailSectionRitBlocksTitle">平台实时预估转化率：</div>
          <div class="DetailSectionRitBlock">
            <div class="DetailSectionRitBlockTitle">
              抖音信息流（{{ data.attributions.loading_page.card_conclusion }}）
            </div>
            <div class="DetailSectionRitBlockBody">
              <span>{{ data.attributions.loading_page.cell_value }}</span>
              <svg
                v-if="data.attributions.loading_page.card_conclusion === '偏低'"
                width="10px"
                height="10px"
                viewBox="0 0 10 10"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <rect id="path-1" x="0" y="0" width="10" height="10"></rect>
                </defs>
                <g
                  id="箭头-偏低"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="Combined-Shape">
                    <mask id="mask-2" fill="white">
                      <use xlink:href="#path-1"></use>
                    </mask>
                    <g id="Mask"></g>
                    <path
                      d="M2.96446609,7.01923714 L7.78641129,7.01923714 C8.20014028,7.01923714 8.53553391,7.35213576 8.53553391,7.76923714 C8.53553391,8.1834507 8.19790936,8.51923714 7.78641129,8.51923714 L2.28465653,8.51923714 C2.05586953,8.51923714 1.85103711,8.41743832 1.71362809,8.25589539 C1.56067725,8.11841361 1.46446609,7.91931346 1.46446609,7.69904671 L1.46446609,2.19729195 C1.46446609,1.78356295 1.79736471,1.44816933 2.21446609,1.44816933 C2.62867966,1.44816933 2.96446609,1.78579388 2.96446609,2.19729195 L2.96446609,7.01923714 Z"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      transform="translate(5.000000, 4.983703) scale(-1, 1) rotate(-45.000000) translate(-5.000000, -4.983703) "
                    ></path>
                    <rect
                      id="Rectangle-2"
                      fill="#F45858"
                      mask="url(#mask-2)"
                      x="4.30000019"
                      y="0"
                      width="1.5"
                      height="9"
                      rx="0.75"
                    ></rect>
                  </g>
                </g>
              </svg>
              <svg
                v-else-if="
                  data.attributions.loading_page.card_conclusion === '正常'
                "
                width="10px"
                height="10px"
                viewBox="0 0 10 2"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g
                  id="Symbols"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="正常" fill="#59C623">
                    <rect
                      id="Rectangle-2"
                      x="0"
                      y="0"
                      width="10"
                      height="2"
                      rx="1"
                    ></rect>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div class="DetailSectionRitBlocksTitle">预估转化率：</div>
          <div class="CurveChart"></div>
          <div v-if="data.attributions.loading_page.landing_page_info">
            <div class="DetailSectionRitBlocksTitle">落地页数据洞察</div>
            <div class="DetailSectionRitBlock2">
              <div class="DetailSectionRitBlockTitle">平均加载时长</div>
              <div class="DetailSectionRitBlockBody2">
                {{
                  (
                    data.attributions.loading_page.landing_page_info.loadTime /
                    1000
                  ).toFixed(2)
                }}秒（{{
                  rankLandingInfo(
                    data.attributions.loading_page.landing_page_info
                      .loadTimeRank
                  )
                }}）
              </div>
              <div class="DetailSectionRitBlockFoot">
                打败了{{
                  (
                    data.attributions.loading_page.landing_page_info
                      .loadTimeRank * 100
                  ).toFixed(2)
                }}%的落地页
              </div>
            </div>
            <div class="DetailSectionRitBlock2">
              <div class="DetailSectionRitBlockTitle">首屏跳失率</div>
              <div class="DetailSectionRitBlockBody2">
                {{
                  (
                    data.attributions.loading_page.landing_page_info
                      .bouncedRate * 100
                  ).toFixed(2)
                }}%（{{
                  rankLandingInfo(
                    data.attributions.loading_page.landing_page_info
                      .bouncedRateRank
                  )
                }}）
              </div>
              <div class="DetailSectionRitBlockFoot">
                打败了{{
                  (
                    data.attributions.loading_page.landing_page_info
                      .bouncedRateRank * 100
                  ).toFixed(2)
                }}%的落地页
              </div>
            </div>
            <div class="DetailSectionRitBlock2">
              <div class="DetailSectionRitBlockTitle">平均阅读比例</div>
              <div class="DetailSectionRitBlockBody2">
                {{
                  data.attributions.loading_page.landing_page_info.exposureRate.toFixed(
                    2
                  )
                }}%（{{
                  rankLandingInfo(
                    data.attributions.loading_page.landing_page_info
                      .exposureRateRank
                  )
                }}）
              </div>
              <div class="DetailSectionRitBlockFoot">
                打败了{{
                  (
                    data.attributions.loading_page.landing_page_info
                      .exposureRateRank * 100
                  ).toFixed(2)
                }}%的落地页
              </div>
            </div>
            <div class="DetailSectionRitBlock2">
              <div class="DetailSectionRitBlockTitle">平均停留时长</div>
              <div class="DetailSectionRitBlockBody2">
                {{
                  (
                    data.attributions.loading_page.landing_page_info.visitTime /
                    1000
                  ).toFixed(2)
                }}（{{
                  rankLandingInfo(
                    data.attributions.loading_page.landing_page_info
                      .visitTimeRank
                  )
                }}）
              </div>
              <div class="DetailSectionRitBlockFoot">
                打败了{{
                  (
                    data.attributions.loading_page.landing_page_info
                      .visitTimeRank * 100
                  ).toFixed(2)
                }}的落地页
              </div>
            </div>
            <div class="DetailSectionCtrCvrTitle">落地页优化总结</div>
            <ol v-if="landingExpand" class="DetailSectionCtrCvrLinks">
              <li
                v-if="
                  data.attributions.loading_page.landing_page_info
                    .loadTimeRank < 0.3
                "
              >
                您的落地页加载速度较慢，建议对落地页中图片数量、大小进行优化
              </li>
              <li
                v-if="
                  data.attributions.loading_page.landing_page_info
                    .bouncedRateRank < 0.3
                "
              >
                <span
                  >您的首屏跳失率较高，建议新增或更换更加清晰或优质的头图;</span
                ><a class="Link">同行业优秀案例</a>
              </li>
              <li
                v-if="
                  data.attributions.loading_page.landing_page_info
                    .exposureRateRank < 0.3
                "
              >
                <span>您的阅读比例较低，建议更换落地页;</span
                ><a class="Link">同行业优秀案例</a>
              </li>
              <li>
                <span>详细诊断建议可进入</span
                ><a class="Link">查看落地页数据洞察 </a>
              </li>
              <li
                v-if="
                  data.attributions.loading_page.landing_page_info
                    .visitTimeRank < 0.3
                "
              >
                图片数量低于行业平均水平，建议增加图片数量到6张或使用多线沟通组件
              </li>
            </ol>
            <div
              @click="landingExpand = !landingExpand"
              class="DetailSectionCtrCvrShowAllBtn"
            >
              <i>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    :d="
                      landingExpand
                        ? 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
                        : 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z'
                    "
                  ></path></svg></i
              ><span>{{ landingExpand ? "收起详情" : "展开查看详情" }}</span>
            </div>
          </div>
          <div class="DetailSectionOperation">
            <div data-json="null" class="Button">
              <div class="Prefix"></div>
              <router-link
                :to="{
                  path: '/idt/ad/edit',
                  query: {
                    idt_id: data.idt_id,
                    ad_id: data.ad_id,
                    campaign_id: data.campaign_id,
                    landing_type: data.landing_type,
                    isGroup: false
                  }
                }"
                target="_blank"
                >前往修改广告落地页</router-link
              >

              <div class="Suffix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const RANK_THRESHOLD = [0.3, 0.4, 0.5, 0.7, 1];
const FUNNEL_RANK_THRESHOLD = [0.2, 0.4, 0.6, 0.8, 1];
const TARGET_BLOCK_THRESHOLD = [0.4, 0.7, 1];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idt_id: {
      type: [String, Number]
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      ecpmVisible: false,
      targetVisible: false,
      bidVisible: false,
      budgetVisible: false,
      creativeVisible: false,
      landingVisible: false,
      targetExpand: false,
      creativeExpand: false,
      landingExpand: false,
      bidParams: {
        visible: true,
        bid: ""
      },
      budgetParams: {
        visible: true,
        budget: ""
      },
      ecpmChartData: null,
      bidChartData: null,
      ctrChartData: null,
      cvrChartData: null
    };
  },
  updated() {
    this.curveChartContainer = document.querySelectorAll(".CurveChart");
    this.ecpmChartContainer = document.querySelector(".EcpmChart");
  },
  mounted() {
    document
      .querySelector(".main-content")
      .addEventListener("click", this.handleAutoClose, { passive: false });
  },
  destroyed() {
    document
      .querySelector(".main-content")
      .removeEventListener("click", this.handleAutoClose);
  },
  computed: {
    getPaths() {
      const { target, rank } = this.data.funnel_data;

      if (!target || !rank) return;

      let x1 = 100 * (1 - target.aim);
      let x2 = 100 * (1 - rank.aim * target.aim);

      return [
        `M0 0 L${x1} 100 L${200 - x1} 100 L200 0 Z`,
        `M${x1} 100 L${x2} 200 L${200 - x2} 200 L${200 - x1} 100 Z`,
        `M${x1} 100 L${200 - x1} 100`
      ];
    },
    getBudgetTitle() {
      if (
        (this.budgetInfo.campaign_budget > 0 &&
          this.budgetInfo.campaign_cost / this.budgetInfo.campaign_budget >
            0.8) ||
        this.budgetInfo.adid_cost / this.budgetInfo.adid_budget > 0.8 ||
        this.budgetInfo.balance < 999.99
      ) {
        return {
          color: "#f5ad41",
          label: "不充足"
        };
      } else {
        return {
          color: "#67c23a",
          label: "充足"
        };
      }
    },
    budgetInfo() {
      let {
        cost: adid_cost,
        budget: adid_budget,
        campaign_budget,
        campaign_cost,
        balance
      } = this.data;

      return {
        adid_cost,
        adid_budget,
        campaign_cost,
        campaign_budget,
        balance
      };
    },
    getBudgetConclusion() {
      return (
        ((this.budgetInfo.campaign_budget > 0 &&
          this.budgetInfo.campaign_cost / this.budgetInfo.campaign_budget >
            0.8) ||
        this.budgetInfo.adid_cost / this.budgetInfo.adid_budget > 0.8 ||
        this.budgetInfo.balance < 999.99
          ? "实时数据：该计划已被系统降速，影响投放，请尽快提高预算/充值，以获得更多展示。"
          : "实时数据：该计划预算充足，不影响计划正常投放") +
        ("\uFF08\u8BCA\u65AD\u671F\u95F4\uFF1A" +
          this.data.attributions.budget.conclusion +
          "\uFF09")
      );
    }
  },
  watch: {
    visible() {
      this.getChartData("ecpmChartData", "ecpm");
      this.getChartData("bidChartData", "bid");
      this.getChartData("ctrChartData", "ctr");
      this.getChartData("cvrChartData", "cvr");
    },
    ecpmVisible(value) {
      value &&
        this.$nextTick(() => {
          this.renderLineChart({
            dom: this.ecpmChartContainer,
            chart: "ecpmChart",
            data: this.ecpmChartData,
            curveLabel: "历史ECPM",
            benchLabel: "标杆ECPM",
            percent: false
          });
        });
    },
    bidVisible(value) {
      value &&
        this.$nextTick(() => {
          this.renderLineChart({
            dom: this.curveChartContainer[0],
            chart: "bidChart",
            data: this.bidChartData,
            yLabel: "出价",
            curveLabel: "历史出价",
            benchLabel: "标杆出价",
            percent: false
          });
        });
    },
    creativeVisible(value) {
      value &&
        this.$nextTick(() => {
          this.renderLineChart({
            dom: this.curveChartContainer[1],
            chart: "ctrChart",
            data: this.ctrChartData,
            yLabel: "预估点击率",
            curveLabel: "预估点击率",
            benchLabel: "标杆点击率"
          });
        });
    },
    landingVisible(value) {
      value &&
        this.$nextTick(() => {
          this.renderLineChart({
            dom: this.curveChartContainer[2],
            chart: "cvrChart",
            data: this.cvrChartData,
            yLabel: "预估转化率",
            curveLabel: "预估转化率",
            benchLabel: "标杆转化率"
          });
        });
    }
  },
  methods: {
    rankBudget(severity) {
      if (severity == null) {
        return "-";
      } else if (severity <= RANK_THRESHOLD[2]) {
        return "充足";
      } else {
        return "不充足";
      }
    },
    rank(severity) {
      if (severity == null) {
        return "-";
      } else if (severity <= RANK_THRESHOLD[0]) {
        return "优秀";
      } else if (severity <= RANK_THRESHOLD[1]) {
        return "较好";
      } else if (severity <= RANK_THRESHOLD[2]) {
        return "一般";
      } else if (severity <= RANK_THRESHOLD[3]) {
        return "较差";
      } else {
        return "很差";
      }
    },
    rankFunnel(severity) {
      if (severity == null) {
        return "-";
      } else if (severity <= FUNNEL_RANK_THRESHOLD[0]) {
        return "优秀";
      } else if (severity <= FUNNEL_RANK_THRESHOLD[1]) {
        return "较好";
      } else if (severity <= FUNNEL_RANK_THRESHOLD[2]) {
        return "一般";
      } else if (severity <= FUNNEL_RANK_THRESHOLD[3]) {
        return "较差";
      } else {
        return "很差";
      }
    },
    rankWithColor(severity) {
      if (severity <= RANK_THRESHOLD[0]) {
        return "#67c23a";
      } else if (severity <= RANK_THRESHOLD[1]) {
        return "#67c23a";
      } else if (severity <= RANK_THRESHOLD[2]) {
        return "#faad15";
      } else if (severity <= RANK_THRESHOLD[3]) {
        return "#faad15";
      } else {
        return "#f56c6c";
      }
    },
    rankWithStars(severity) {
      if (severity <= RANK_THRESHOLD[0]) {
        return ["#67c23a", "#67c23a", "#67c23a", "#67c23a", "#67c23a"];
      } else if (severity <= RANK_THRESHOLD[1]) {
        return ["#67c23a", "#67c23a", "#67c23a", "#67c23a", ""];
      } else if (severity <= RANK_THRESHOLD[2]) {
        return ["#f5ad41", "#f5ad41", "#f5ad41", "", ""];
      } else if (severity <= RANK_THRESHOLD[3]) {
        return ["#f5ad41", "#f5ad41", "", "", ""];
      } else {
        return ["#f56c6c", "", "", "", ""];
      }
    },
    rankTarget(target) {
      var aud_num, blueocean, precision, severity;
      if (target) {
        aud_num = target.aud_num;
        precision = target.precision;
        blueocean = target.blueocean;

        severity = (aud_num + precision + blueocean) / 3;
        return this.rank(1 - severity);
      } else {
        return "-";
      }
    },
    rankTargetWithColor(target) {
      var aud_num, blueocean, precision, severity;
      if (target) {
        aud_num = target.aud_num;
        precision = target.precision;
        blueocean = target.blueocean;

        severity = (aud_num + precision + blueocean) / 3;
        return this.rankWithColor(1 - severity);
      } else {
        return "-";
      }
    },
    rankTargetBlocks(severity) {
      if (severity <= TARGET_BLOCK_THRESHOLD[0]) {
        return ["TargetBlockGreen", "TargetBlockEmpty", "TargetBlockEmpty"];
      } else if (severity <= TARGET_BLOCK_THRESHOLD[1]) {
        return ["TargetBlockGreen", "TargetBlockGreen", "TargetBlockEmpty"];
      } else {
        return ["TargetBlockGreen", "TargetBlockGreen", "TargetBlockGreen"];
      }
    },
    rankLandingInfo(rank) {
      if (rank < 0.3) {
        return "较差";
      } else if (rank < 0.6) {
        return "正常";
      } else {
        return "较好";
      }
    },
    /**
     * 获取报表数据
     */
    getChartData(chart, type) {
      if (this[chart]) return;

      let params = {
        idt_id: this.idt_id,
        ad_id: this.data.ad_id,
        type
      };

      this.$axios
        .get("/Admin/Toutiao_Tools/getDiagnosisAdCurve", { params })
        .then(res => {
          if (res.code === 0) {
            let { time_line, curve_rank, bench_curve_rank } = res.data;

            // 数据不能带%,需特殊处理
            if (["ctr", "cvr"].includes(type)) {
              curve_rank = curve_rank.map(item => {
                return parseFloat(item) / 100;
              });
              bench_curve_rank = bench_curve_rank.map(item => {
                return parseFloat(item) / 100;
              });
            }

            this[chart] = { time_line, curve_rank, bench_curve_rank };

            if (type === "ecpm" && this.ecpmVisible) {
              this.renderLineChart({
                dom: this.ecpmChartContainer,
                chart: "ecpmChart",
                data: this[chart],
                curveLabel: "历史ECPM",
                benchLabel: "标杆ECPM",
                percent: false
              });
            } else if (type === "bid" && this.bidVisible) {
              this.renderLineChart({
                dom: this.curveChartContainer[0],
                chart: "bidChart",
                data: this[chart],
                yLabel: "出价",
                curveLabel: "历史出价",
                benchLabel: "标杆出价",
                percent: false
              });
            } else if (type === "ctr" && this.bidVisible) {
              this.renderLineChart({
                dom: this.curveChartContainer[1],
                chart: "ctrChart",
                data: this[chart],
                yLabel: "预估点击率",
                curveLabel: "预估点击率",
                benchLabel: "标杆点击率"
              });
            } else if (type === "cvr" && this.bidVisible) {
              this.renderLineChart({
                dom: this.curveChartContainer[2],
                chart: "cvrChart",
                data: this[chart],
                yLabel: "预估转化率",
                curveLabel: "预估转化率",
                benchLabel: "标杆转化率"
              });
            }
          }
        });
    },
    /**
     * 渲染拆线图
     */
    renderLineChart({
      dom,
      chart,
      data,
      yLabel,
      curveLabel,
      benchLabel,
      percent = true
    }) {
      if (!dom || !data) {
        return;
      }

      if (this[chart] != null) {
        this[chart].dispose();
      }

      const { bench_curve_rank, curve_rank, time_line } = data;
      const options = {
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: 10,
          trigger: "axis",
          formatter(arr) {
            // eslint-disable-next-line
            var color, dataIndex, seriesIndex, seriesName, v, value;
            return (
              curveLabel +
              ": " +
              arr[0].name +
              "<br>" +
              (function() {
                var j, len, results;
                results = [];
                for (j = 0, len = arr.length; j < len; j++) {
                  var _arr$j2 = arr[j];
                  seriesName = _arr$j2.seriesName;
                  color = _arr$j2.color;
                  seriesIndex = _arr$j2.seriesIndex;
                  dataIndex = _arr$j2.dataIndex;
                  value = _arr$j2.value;

                  v = percent ? (value * 100).toFixed(2) + "%" : value;
                  results.push(
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" +
                      color +
                      ";'></span>" +
                      seriesName +
                      ": " +
                      v
                  );
                }
                return results;
              })().join("<br>")
            );
          }
        },
        grid: {
          borderWidth: 0,
          show: true,
          top: "15%",
          bottom: "10%",
          left: "8%",
          right: "12%"
        },
        xAxis: {
          name: "时间",
          type: "category",
          boundaryGap: false,
          data: time_line
        },
        yAxis: {
          type: "value",
          name: yLabel,
          axisLabel: {
            formatter(v) {
              if (percent) {
                return (v * 100).toFixed(2) + "%";
              } else {
                return v;
              }
            }
          }
        },
        series: [
          {
            name: curveLabel,
            type: "line",
            symbol: "circle",
            symbolSize: 4,
            showAllSymbol: true,
            data: curve_rank
          },
          {
            name: benchLabel,
            type: "line",
            symbol: "triangle",
            symbolSize: 4,
            showAllSymbol: true,
            data: bench_curve_rank
          }
        ]
      };

      this[chart] = this.$echarts.init(dom, "shine");

      return this[chart].setOption(options);
    },
    handleAutoClose(e) {
      if (!this.visible) return;
      let rect = this.$el.getBoundingClientRect();
      if (e.x < rect.x - 150) {
        this.handleClose();
      }
    },
    handleClose() {
      this.$emit("close");
    },
    handlePosition(visibleName, elementId) {
      this[visibleName] = true;
      this.$nextTick(() => {
        const { offsetTop } = document.getElementById(elementId);
        this.$el.scrollTo(0, offsetTop);
      });
    },
    /**
     *修改出价
     */
    handleUpdateBid(bid) {
      const {
        idt_id,
        data: { ad_id }
      } = this;

      let maxBid, minBid, pricing, v;
      v = parseFloat(bid);

      if (isNaN(v)) {
        return this.$message.error("请输入合法的出价");
      } else {
        pricing = this.data.pricing;

        minBid =
          {
            PRICING_OCPC: 0.1,
            PRICING_OCPM: 0.1,
            PRICING_CPC: 0.2,
            PRICING_CPM: 4,
            PRICING_CPA: 1
          }[pricing] || 1;

        maxBid =
          {
            PRICING_OCPC: 3000,
            PRICING_OCPM: 3000,
            PRICING_CPC: 100,
            PRICING_CPM: 100,
            PRICING_CPA: 1500
          }[pricing] || 1000;

        if (v < minBid) {
          return this.$message.error("出价不能低于" + minBid + "元");
        }
        if (v > maxBid) {
          return this.$message.error("出价不能高于" + maxBid + "元");
        }

        this.$axios
          .post("/Admin/Toutiao_Ad/updateBid", {
            idt_id,
            data: [{ ad_id, bid }]
          })
          .then(res => {
            if (res.code === 0) {
              this.$message.success("修改出价成功");

              this.data.bid = bid;
              this.bidParams = {
                visible: false,
                bid: ""
              };
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    /**
     * 修改预算
     */
    handleUpdateBudget() {
      const {
        idt_id,
        budgetParams: { budget },
        data: { ad_id }
      } = this;

      let maxBudget, minBudget, pricing, v;

      v = parseFloat(budget);
      if (isNaN(v)) {
        return this.$message.error("请输入合法的预算");
      } else {
        pricing = this.data.pricing;
        minBudget =
          {
            PRICING_OCPC: 300,
            PRICING_OCPM: 300,
            PRICING_CPC: 1000,
            PRICING_CPM: 300,
            PRICING_CPA: 100
          }[pricing] || 300;

        maxBudget = 9999999.99;

        if (v < minBudget) {
          return this.$message.error("预算不能低于" + minBudget + "元");
        }
        if (v > maxBudget) {
          return this.$message.error("预算不能高于" + maxBudget + "元");
        }

        this.$axios
          .post("/Admin/Toutiao_Ad/updateBudget", {
            idt_id,
            data: [{ ad_id, budget }]
          })
          .then(res => {
            if (res.code === 0) {
              this.$message.success("修改预算成功");

              this.data.budget = budget;
              this.budgetParams = {
                visible: false,
                budget: ""
              };
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.TextInput {
  width: 200px;
  position: relative;
  line-height: 1.93em;
  height: 1.93em;
  font-size: 1em;
}
.TextInput .Input {
  box-sizing: border-box;
  display: block;
  border: 1px solid #cccccc;
  width: 100%;
  height: 100%;
  font-size: 1em;
  padding: 0 0.4em;
  -webkit-appearance: none;
  border-radius: 0;
  line-height: normal;
}

.ButtonGroup .EnabledBtn,
.ButtonGroup .DisabledBtn {
  position: relative;
  display: inline-block;
  margin: 0;
  margin-right: 1em;
  width: 100px;
  text-align: center;
  list-style: none;
  outline: 1px solid #01bad2;
  line-height: 2em;
  height: 2em;
  font-size: 1em;
}

.ButtonGroup .DisabledBtn {
  color: #01bad2;
  background: #fff;
}

.AdDetail {
  position: fixed;
  width: 750px;
  top: 0;
  bottom: 0;
  right: -500px;
  background: #fff;
  transition: right 0.3s;
  box-shadow: 0px 0px 5px rgba(81, 84, 99, 0.3);
  border-left: 1px solid #dee4f5;
  font-size: 14px;
  overflow: auto;
  z-index: 999;
}

.QuestionMark {
  position: relative;
  display: inline-block;
  width: 2em;
  height: 2em;
}
.QuestionMark svg {
  fill: #01bad2;
}
.QuestionMark .Message {
  display: none;
  position: absolute;
  background: #fff;
  border: 1px solid #d8e2f5;
  box-shadow: 0 0 5px #dee2f5;
  border-radius: 2px;
  width: 400px;
  left: -40px;
  bottom: 33px;
  padding: 8px;
}
.QuestionMark .Arrow {
  display: none;
  position: absolute;
  top: -13px;
  left: 5px;
  width: 11px;
  height: 11px;
  background: #fff;
  z-index: 1;
  transform: rotate(45deg);
}
.QuestionMark .ArrowBorder {
  display: none;
  position: absolute;
  top: -14px;
  left: 4px;
  z-index: -1;
  width: 12px;
  height: 12px;
  border: 1px solid #d8e2f5;
  box-shadow: 0 0 5px #dee2f5;
  transform: rotate(45deg);
}
.QuestionMark:hover .Arrow,
.QuestionMark:hover .ArrowBorder,
.QuestionMark:hover .Message {
  display: block;
}

.AdDetail .QuestionMark {
  vertical-align: middle;
  display: inline-block;
  margin-top: -14px;
  margin-left: 4px;
  height: 14px;
}
.AdDetail .QuestionMark svg {
  width: 18px;
  vertical-align: middle;
  fill: #d8d8d8;
}
.AdDetail .QuestionMark svg:hover {
  fill: #999;
}
.AdDetail .QuestionMark .Arrow {
  top: -19px;
  left: 2px;
  width: 14px;
  height: 14px;
  z-index: 3;
}
.AdDetail .QuestionMark .ArrowBorder {
  top: -20px;
  left: 1px;
  width: 16px;
  height: 16px;
  z-index: 1;
}
.AdDetail .QuestionMark .Message {
  text-align: left;
  bottom: 24px;
  z-index: 2;
  width: 300px;
  border: 1px solid #dee4f5;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
}

.AdDetail .QuestionMark .Message h1 {
  color: #333;
  margin: 8px;
  font-size: 14px;
  font-weight: 300;
}
.AdDetail .QuestionMark .Message p {
  margin: 8px;
  color: #555;
  font-size: 13px;
}
.AdDetail .DetailTitle {
  border-bottom: 1px solid #e9e9e9;
  padding: 8px 24px;
}
.AdDetail .DetailTitle .DetailCloseBtn {
  cursor: pointer;
  float: right;
}
.AdDetail .DetailTitle .DetailCloseBtn:hover {
  color: #598fe6;
}
.AdDetail .DetailTable .Label {
  color: #666;
  text-align: right;
  min-width: 75px;
  line-height: 22px;
  height: 22px;
}
.AdDetail .DetailTable .Value {
  padding-left: 12px;
}
.AdDetail .DetailTable svg,
.AdDetail .DetailTable span {
  margin: 0 2px;
  vertical-align: middle;
}
.AdDetail .DetailTable svg {
  margin-top: -2px;
}
.AdDetail .DetailTable .Hint {
  margin-left: 8px;
  color: #666;
}
.AdDetail .ColdStart {
  margin: 8px 4px;
  background: #fdf7f7;
  border: 1px solid #ff6f68;
}
.AdDetail .ColdStart p {
  margin: 12px;
}
.AdDetail .CopyADNote {
  margin: 8px 4px;
  background: #fdf7f7;
  border: 1px solid #ff6f68;
}
.AdDetail .CopyADNote p,
.AdDetail .CopyADNote ul,
.AdDetail .CopyADNote .Button {
  margin: 12px;
}
.AdDetail .CopyADNote ul {
  padding: 0 24px;
}
.AdDetail .CopyADNote .Button {
  background: #598fe6;
  border-radius: 2px;
  width: auto;
  min-width: 104px;
  display: inline-block;
  padding: 0 16px;
  line-height: 34px;
  height: 34px;
}
.AdDetail .DetailBasic {
  margin: 22px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e9e9e9;
}
.AdDetail .DetailBasic .DetailBasicTitle {
  font-size: 16px;
  margin: 12px 0;
}
.AdDetail .DetailAdv {
  margin: 22px;
}
.AdDetail .DetailAdv .DetailAdvTitle {
  font-size: 16px;
  margin: 12px 0;
}
.AdDetail .DetailAdv .DetailTabTable {
  margin: 12px 0;
  border-radius: 2px;
  border-collapse: collapse;
}
.AdDetail .DetailAdv .DetailTabTable .DetailTab {
  padding: 0 17px;
  min-width: 104px;
  height: 34px;
  line-height: 34px;
  display: inline-block;
  border: 1px solid #dee4f5;
  cursor: pointer;
}
.AdDetail .DetailAdv .DetailTabTable .DetailTab.Current {
  background: #f4f7ff;
  border: 1px solid #598fe6;
  color: #598fe6;
}
.AdDetail .DetailAdv .DetailTabTable .DetailTab.First {
  border-radius: 2px 0 0 2px;
}
.AdDetail .DetailAdv .DetailTabTable .DetailTab.Last {
  border-radius: 0 2px 2px 0;
}
.AdDetail .DetailAdv .DetailTitleRit {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 12px;
  font-size: 15px;
}
.AdDetail .DetailAdv .DetailHintRit {
  font-size: 13px;
  color: #999;
  margin: 8px 0;
}
.AdDetail .DetailAdv .FunnelSection {
  position: relative;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection1,
.AdDetail .DetailAdv .FunnelSection .FunnelSection2 {
  position: absolute;
  left: 260px;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection1 .FunnelSectionTitle,
.AdDetail .DetailAdv .FunnelSection .FunnelSection2 .FunnelSectionTitle {
  font-size: 15px;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection1 .FunnelSectionHint,
.AdDetail .DetailAdv .FunnelSection .FunnelSection2 .FunnelSectionHint {
  font-size: 13px;
  color: #999;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection1 .FunnelSectionHint a,
.AdDetail .DetailAdv .FunnelSection .FunnelSection2 .FunnelSectionHint a {
  cursor: pointer;
  color: #598fe6;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection1 {
  top: 100px;
}
.AdDetail .DetailAdv .FunnelSection .FunnelSection2 {
  top: 200px;
}
.AdDetail .DetailAdv .DetailSection {
  background: #f3f3f3;
  border: 1px solid e9e9e9;
  margin: 12px 0;
  transition: max-height 0.1s;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup {
  margin: 16px 0;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .EnabledBtn,
.AdDetail .DetailAdv .DetailSection .ButtonGroup .DisabledBtn {
  margin-right: -1px;
  width: 160px;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .EnabledBtn {
  background: #f4f7fe;
  border: 1px solid #598fe6;
  outline: none;
  color: #598fe6;
  z-index: 2;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .EnabledBtn i {
  display: none;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .EnabledBtn:hover {
  border: 1px solid #598fe6;
  background: #f4f7fe;
  color: #598fe6;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .DisabledBtn {
  color: #333;
  border: 1px solid #dee4f5;
  outline: none;
}
.AdDetail .DetailAdv .DetailSection .ButtonGroup .DisabledBtn:hover {
  background: #fff;
  color: #598fe6;
}
.AdDetail .DetailAdv .DetailSection .EcpmChart,
.AdDetail .DetailAdv .DetailSection .CurveChart {
  width: 100%;
  height: 200px;
}
.AdDetail .DetailAdv .DetailSection .EcpmTable {
  border-top: 1px solid #e8e8e8;
  width: 640px;
  border-collapse: collapse;
  background: #fff;
}
.AdDetail .DetailAdv .DetailSection .EcpmTable th {
  background: #fafbfe;
  font-weight: 300;
  min-width: 80px;
  vertical-align: middle;
}
.AdDetail .DetailAdv .DetailSection .EcpmTable th,
.AdDetail .DetailAdv .DetailSection .EcpmTable td {
  border: 1px solid #e8e8e8;
  text-align: left;
  padding: 8px;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionTitle {
  padding: 8px 16px;
  cursor: pointer;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionTitle .Content {
  font-weight: 500;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionTitle .DetailSectionArrow {
  float: right;
  transform: scale(1, 0.8);
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent {
  border-top: 1px solid #e9e9e9;
  padding: 16px;
  padding-right: 0;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionConclusion {
  color: #555;
  margin-bottom: 12px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlocksTitle {
  margin: 12px 0;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2 {
  display: inline-block;
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  margin-right: 16px;
  padding: 8px 0 0 8px;
  width: 150px;
  height: 70px;
  overflow: auto;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockTitle,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockTitle {
  margin: 0 8px 8px 8px;
  font-size: 13px;
  color: #555;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockTitle:before,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockTitle:before {
  content: "";
  width: 0px;
  height: 0px;
  border-radius: 2px;
  border: 2px solid #e1e1e1;
  display: inline-block;
  position: relative;
  left: -8px;
  top: -3px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockBody,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockBody {
  text-align: center;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockBody
  span,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockBody
  span {
  margin-right: 4px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockBody2,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockBody2 {
  text-align: center;
  font-size: 17px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock
  .DetailSectionRitBlockFoot,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2
  .DetailSectionRitBlockFoot {
  color: #555;
  font-size: 12px;
  margin-top: 10px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionRitBlock2 {
  box-sizing: border-box;
  height: 100px;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .TargetBlockGreen,
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .TargetBlockEmpty {
  display: inline-block;
  width: 24px;
  height: 8px;
  margin: 0 4px;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .TargetBlockGreen {
  background: #39c602;
  border: 1px solid #39c602;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .TargetBlockEmpty {
  border: 1px solid #e9e9e9;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionTargetBlockTitle {
  margin-top: 8px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionTargetBlockNote {
  color: #555;
  margin-bottom: 12px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrTitle {
  margin: 12px 0;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrShowAllBtn {
  cursor: pointer;
  color: #598fe6;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrShowAllBtn
  svg {
  height: 22px;
  fill: #598fe6;
  vertical-align: bottom;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrLinks {
  padding-left: 40px;
  color: #666;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrLinks
  li {
  line-height: 22px;
  list-style-type: decimal;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrLinks
  .Link {
  cursor: pointer;
  text-decoration: none;
  color: #598fe6;
  margin-left: 4px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrLinks
  .RecommendTitle {
  border: none;
  outline: none;
  background: none;
  width: 500px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .DetailSectionCtrCvrLinks
  .FloatRight {
  float: right;
  margin-right: 32px;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .FutureStarTable {
  margin: 14px 0;
  border-collapse: collapse;
  width: 480px;
  background: #fff;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .FutureStarTable th,
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .FutureStarTable td {
  border: 1px solid#cccccc;
  padding: 4px;
  text-align: center;
  color: #525252;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .FutureStarTable th a,
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .FutureStarTable
  td
  a {
  color: #a3a3a3;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionContent .FutureStarTable th {
  background-color: #f5f6f9;
  color: #303133;
  font-weight: 500;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionContent
  .FutureStarTable
  .Link {
  color: #598fe6;
  cursor: pointer;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionOperation {
  margin-top: 12px;
  padding: 8px 0 0 8px;
  border-top: 1px solid #e9e9e9;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionOperation .Link {
  display: inline-block;
  color: #598fe6;
  cursor: pointer;
  margin-left: 24px;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionOperation .TextInput {
  display: inline-block;
  width: 100px;
  margin-right: 4px;
  margin-bottom: 8px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionOperation
  .TextInput
  .ValidationMsg {
  background: none;
  position: absolute;
  color: red;
  top: 2em;
  left: -4em;
  font-size: 12px;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionOperation
  .TextInput
  .ValidationMsg:before {
  display: none;
}
.AdDetail
  .DetailAdv
  .DetailSection
  .DetailSectionOperation
  .DetailSectionOperationBtn {
  display: inline-block;
  margin-left: 24px;
  text-decoration: none;
  cursor: pointer;
  color: #598fe6;
}
.AdDetail .DetailAdv .DetailSection .DetailSectionOperation .Button {
  box-sizing: border-box;
  background: #598fe6;
  border-radius: 2px;
  width: auto;
  min-width: 104px;
  display: inline-block;
  padding: 0 16px;
  line-height: 34px;
  height: 34px;
  a {
    color: #fff;
  }
}
.AdDetail .DetailAdv .DetailSection .DetailSectionOperation .Spinner {
  margin-left: 22px;
  vertical-align: middle;
  display: inline-block;
}
</style>
