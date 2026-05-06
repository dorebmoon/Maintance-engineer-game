/**
 * ELK 日志系统 - 关卡数据
 * 从基础查询到高级日志分析和仪表盘
 */
const ELK_LEVELS = {
  world: 'elk',
  name: 'ELK 日志系统',
  icon: '📊',
  description: '学习 Elasticsearch、Logstash、Kibana 日志系统的搭建和使用，从基础查询到高级日志分析。',
  color: '#69f0ae',
  levels: [
    // ============ 初级 - Elasticsearch 基础 ============
    {
      id: 'elk-01',
      title: 'Elasticsearch 索引',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Elasticsearch REST API 创建一个索引：</p>
<ul>
<li>索引名称：<code>logs-2024</code></li>
<li>设置分片数为 <code>1</code>，副本数为 <code>0</code></li>
</ul>`,
      hint: 'PUT /索引名，JSON body 设置 number_of_shards 和 number_of_replicas',
      theory: `<h4>Elasticsearch 索引基础</h4>
<p><strong>索引（Index）</strong> 是 Elasticsearch 中存储数据的基本单位，类似数据库中的"表"。</p>
<pre>PUT /logs-2024
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  }
}</pre>
<p>核心概念：</p>
<ul>
<li><strong>Index</strong>：索引（类似数据库）</li>
<li><strong>Document</strong>：文档（类似一行记录）</li>
<li><strong>Field</strong>：字段（文档的属性）</li>
<li><strong>Shard</strong>：分片（数据的物理分割）</li>
</ul>`,
      initialCode: '# 创建索引\nPUT /logs-2024\n',
      sampleData: ['{"acknowledged":true,"shards_acknowledged":true,"index":"logs-2024"}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /put\s*\/logs-2024/.test(normalized) &&
               /number_of_shards.*1/.test(normalized) &&
               /number_of_replicas.*0/.test(normalized);
      },
      successMsg: '索引创建成功！这是使用 Elasticsearch 的第一步。'
    },
    {
      id: 'elk-02',
      title: '索引文档（写入数据）',
      difficulty: 'easy',
      xp: 60,
      instruction: `<h4>🎯 任务</h4>
<p>向 <code>logs-2024</code> 索引中添加一条日志文档：</p>
<pre>{
  "timestamp": "2024-01-01T10:00:00Z",
  "level": "ERROR",
  "service": "user-service",
  "message": "Database connection timeout"
}</pre>
<p>文档 ID 为 <code>1</code>。</p>`,
      hint: 'PUT /索引名/_doc/文档ID，body 为 JSON 文档',
      theory: `<h4>索引文档</h4>
<p>向索引中写入（索引）一条文档：</p>
<pre>PUT /logs-2024/_doc/1
{
  "timestamp": "2024-01-01T10:00:00Z",
  "level": "ERROR",
  "service": "user-service",
  "message": "Database connection timeout"
}</pre>
<p>也可以不指定 ID，让 ES 自动生成：</p>
<pre>POST /logs-2024/_doc
{ ... }</pre>`,
      initialCode: '# 索引一条日志文档\n',
      sampleData: ['{"_index":"logs-2024","_id":"1","result":"created"}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /put\s*\/logs-2024\/_doc\/1/.test(normalized) &&
               /level.*error/i.test(normalized) &&
               /user-service/.test(normalized) &&
               /database.*connection.*timeout/i.test(normalized);
      },
      successMsg: '文档写入成功！Elasticsearch 会自动建立倒排索引。'
    },
    {
      id: 'elk-03',
      title: '基础查询 (Match)',
      difficulty: 'easy',
      xp: 70,
      instruction: `<h4>🎯 任务</h4>
<p>在 <code>logs-2024</code> 索引中搜索包含关键词 <code>"timeout"</code> 的日志。</p>`,
      hint: 'GET /索引名/_search，body 使用 { "query": { "match": { "message": "关键词" } } }',
      theory: `<h4>Match 查询</h4>
<p><code>match</code> 是最常用的全文搜索查询：</p>
<pre>GET /logs-2024/_search
{
  "query": {
    "match": {
      "message": "timeout"
    }
  }
}</pre>
<p>常见查询类型：</p>
<ul>
<li><code>match</code>：全文搜索（会分词）</li>
<li><code>term</code>：精确匹配（不分词）</li>
<li><code>range</code>：范围查询</li>
<li><code>bool</code>：组合查询</li>
</ul>`,
      initialCode: '# 搜索包含 timeout 的日志\n',
      sampleData: ['{"hits":{"total":{"value":1},"hits":[{"_source":{"message":"Database connection timeout"}}]}}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /get\s*\/logs-2024\/_search/.test(normalized) &&
               /match/.test(normalized) &&
               /message.*timeout/.test(normalized);
      },
      successMsg: 'Match 查询是 Elasticsearch 最基础也最强大的查询方式！'
    },
    {
      id: 'elk-04',
      title: '精确查询 (Term)',
      difficulty: 'easy',
      xp: 70,
      instruction: `<h4>🎯 任务</h4>
<p>搜索 <code>logs-2024</code> 索引中 <code>level</code> 字段精确等于 <code>"ERROR"</code> 的日志。</p>`,
      hint: '使用 term 查询：{ "query": { "term": { "level": "ERROR" } } }',
      theory: `<h4>Term 查询</h4>
<p><code>term</code> 用于精确匹配，不会对搜索词分词：</p>
<pre>GET /logs-2024/_search
{
  "query": {
    "term": {
      "level": "ERROR"
    }
  }
}</pre>
<p><strong>Match vs Term：</strong></p>
<ul>
<li><code>match</code>：适合全文搜索，如日志消息</li>
<li><code>term</code>：适合精确字段，如状态码、级别、ID</li>
</ul>
<p>⚠️ 注意：keyword 类型字段用 term，text 类型字段用 match。</p>`,
      initialCode: '# 搜索 ERROR 级别的日志\n',
      sampleData: ['{"hits":{"total":{"value":2},"hits":[]}}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /get\s*\/logs-2024\/_search/.test(normalized) &&
               /term/.test(normalized) &&
               /level.*error/.test(normalized);
      },
      successMsg: 'Term 查询适合对结构化字段进行精确过滤！'
    },
    // ============ 中级 - 复合查询与聚合 ============
    {
      id: 'elk-05',
      title: 'Bool 组合查询',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>搜索 <code>logs-2024</code> 索引中：</p>
<ul>
<li><code>level</code> 为 <code>"ERROR"</code></li>
<li>且 <code>service</code> 为 <code>"user-service"</code></li>
</ul>
<p>使用 bool 查询的 must 子句。</p>`,
      hint: '使用 { "query": { "bool": { "must": [ { "term": ... }, { "term": ... } ] } } }',
      theory: `<h4>Bool 组合查询</h4>
<p>Bool 查询组合多个条件：</p>
<pre>GET /logs-2024/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "level": "ERROR" } },
        { "term": { "service": "user-service" } }
      ]
    }
  }
}</pre>
<p>Bool 子句：</p>
<ul>
<li><code>must</code>：必须满足（影响评分）</li>
<li><code>filter</code>：必须满足（不影响评分，可缓存，性能更好）</li>
<li><code>should</code>：满足加分</li>
<li><code>must_not</code>：必须不满足</li>
</ul>`,
      initialCode: '# 搜索 user-service 的 ERROR 日志\n',
      sampleData: ['{"hits":{"total":{"value":1}}}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /bool/.test(normalized) &&
               /must/.test(normalized) &&
               /level.*error/.test(normalized) &&
               /service.*user-service/.test(normalized);
      },
      successMsg: 'Bool 查询让你可以灵活组合各种条件！'
    },
    {
      id: 'elk-06',
      title: 'Range 范围查询',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>搜索 <code>logs-2024</code> 索引中 <code>timestamp</code> 在 <code>2024-01-01</code> 到 <code>2024-01-31</code> 之间的日志。</p>`,
      hint: '使用 range 查询：{ "range": { "timestamp": { "gte": "2024-01-01", "lte": "2024-01-31" } } }',
      theory: `<h4>Range 范围查询</h4>
<p>Range 查询用于数值或日期范围：</p>
<pre>GET /logs-2024/_search
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "2024-01-01",
        "lte": "2024-01-31"
      }
    }
  }
}</pre>
<p>范围操作符：</p>
<ul>
<li><code>gt</code>：大于</li>
<li><code>gte</code>：大于等于</li>
<li><code>lt</code>：小于</li>
<li><code>lte</code>：小于等于</li>
</ul>`,
      initialCode: '# 搜索一月份的日志\n',
      sampleData: ['{"hits":{"total":{"value":156}}}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /range/.test(normalized) &&
               /timestamp/.test(normalized) &&
               /2024-01-01/.test(normalized) &&
               /2024-01-31/.test(normalized);
      },
      successMsg: '范围查询在日志时间过滤中非常常用！'
    },
    {
      id: 'elk-07',
      title: '聚合分析 (Aggregation)',
      difficulty: 'medium',
      xp: 120,
      instruction: `<h4>🎯 任务</h4>
<p>统计 <code>logs-2024</code> 索引中每个日志级别（level）的数量。</p>`,
      hint: '使用 aggs：{ "aggs": { "levels": { "terms": { "field": "level" } } } }',
      theory: `<h4>聚合分析</h4>
<p>聚合（Aggregation）是 Elasticsearch 的数据分析能力：</p>
<pre>GET /logs-2024/_search
{
  "size": 0,
  "aggs": {
    "levels": {
      "terms": {
        "field": "level.keyword"
      }
    }
  }
}</pre>
<p>聚合类型：</p>
<ul>
<li><strong>Bucket</strong>（桶聚合）：terms, date_histogram, range</li>
<li><strong>Metric</strong>（指标聚合）：avg, sum, max, min, count</li>
<li><strong>Pipeline</strong>（管道聚合）：对聚合结果再聚合</li>
</ul>
<p><code>"size": 0</code> 表示不返回文档，只返回聚合结果。</p>`,
      initialCode: '# 统计各级别日志数量\n',
      sampleData: ['{"aggregations":{"levels":{"buckets":[{"key":"ERROR","doc_count":42},{"key":"INFO","doc_count":350}]}}}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /aggs|aggregations/.test(normalized) &&
               /terms/.test(normalized) &&
               /level/.test(normalized);
      },
      successMsg: '聚合分析是 ELK 日志系统的核心价值所在！'
    },
    // ============ 高级 - Logstash 管道 ============
    {
      id: 'elk-08',
      title: 'Logstash Input 配置',
      difficulty: 'hard',
      xp: 130,
      instruction: `<h4>🎯 任务</h4>
<p>配置一个 Logstash 管道：</p>
<ul>
<li>输入：从文件 <code>/var/log/app.log</code> 读取</li>
<li>使用 <code>file</code> input 插件</li>
<li>设置文件路径和起始位置为 <code>beginning</code></li>
</ul>`,
      hint: 'input { file { path => "/var/log/app.log" start_position => "beginning" } }',
      theory: `<h4>Logstash 管道</h4>
<p>Logstash 由三个阶段组成：</p>
<pre>input { ... }    # 数据输入
filter { ... }   # 数据处理
output { ... }   # 数据输出</pre>
<p>Input 插件示例：</p>
<pre>input {
  file {
    path => "/var/log/app.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
}</pre>
<p>常用 Input 插件：</p>
<ul>
<li><code>file</code>：读取文件</li>
<li><code>beats</code>：接收 Filebeat 数据</li>
<li><code>kafka</code>：消费 Kafka 消息</li>
<li><code>tcp</code>/<code>udp</code>：网络输入</li>
</ul>`,
      initialCode: 'input {\n  file {\n',
      sampleData: ['Pipeline started successfully.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /input/.test(normalized) &&
               /file/.test(normalized) &&
               /\/var\/log\/app\.log/.test(normalized) &&
               /start_position.*beginning/.test(normalized);
      },
      successMsg: 'Logstash Input 配置完成！接下来是 Filter 和 Output。'
    },
    {
      id: 'elk-09',
      title: 'Logstash Filter (Grok)',
      difficulty: 'hard',
      xp: 150,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Grok 过滤器解析以下格式的 Apache 日志：</p>
<pre>192.168.1.1 - - [01/Jan/2024:10:00:00 +0800] "GET /api/users HTTP/1.1" 200 1234</pre>
<p>提取字段：client_ip, method, path, status_code, bytes</p>`,
      hint: 'filter { grok { match => { "message" => "%{IP:client_ip} ..." } } }',
      theory: `<h4>Grok 过滤器</h4>
<p>Grok 是 Logstash 最强大的日志解析插件：</p>
<pre>filter {
  grok {
    match => {
      "message" => '%{IPORHOST:client_ip} %{USER:ident} %{USER:auth} \[%{HTTPDATE:timestamp}\] "%{WORD:method} %{URIPATHPARAM:path} HTTP/%{NUMBER:http_version}" %{NUMBER:status_code} %{NUMBER:bytes}'
    }
  }
}</pre>
<p>常用 Grok 模式：</p>
<ul>
<li><code>%{IP:field}</code>：IP 地址</li>
<li><code>%{TIMESTAMP_ISO8601:field}</code>：ISO 时间</li>
<li><code>%{NUMBER:field}</code>：数字</li>
<li><code>%{WORD:field}</code>：单词</li>
<li><code>%{GREEDYDATA:field}</code>：任意数据</li>
</ul>`,
      initialCode: 'filter {\n  grok {\n    match => {\n      "message" => \'',
      sampleData: ['{"client_ip":"192.168.1.1","method":"GET","path":"/api/users","status_code":"200","bytes":"1234"}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /grok/.test(normalized) &&
               /ip.*client_ip|iporhost.*client_ip/.test(normalized) &&
               /word.*method/.test(normalized) &&
               /number.*status_code/.test(normalized);
      },
      successMsg: 'Grok 是日志解析的核心工具，掌握它就能解析任何格式的日志！'
    },
    // ============ 专家级 - Kibana 与可视化 ============
    {
      id: 'elk-10',
      title: 'Kibana Query (KQL)',
      difficulty: 'expert',
      xp: 160,
      instruction: `<h4>🎯 任务</h4>
<p>写出 Kibana KQL 查询，搜索：</p>
<ul>
<li><code>service</code> 为 <code>"order-service"</code></li>
<li>且 <code>level</code> 为 <code>"ERROR"</code> 或 <code>"WARN"</code></li>
</ul>`,
      hint: 'service: "order-service" and (level: "ERROR" or level: "WARN")',
      theory: `<h4>Kibana 查询语言 (KQL)</h4>
<p>KQL 是 Kibana 中的查询语言，语法简洁：</p>
<pre># 精确匹配
service: "order-service"

# 组合查询
service: "order-service" and level: "ERROR"

# 或查询
level: "ERROR" or level: "WARN"

# 通配符
message: *timeout*

# 范围
response_time > 1000</pre>
<p>KQL vs Lucene：</p>
<ul>
<li>KQL 更简洁，推荐在 Kibana 中使用</li>
<li>Lucene 更灵活，支持正则表达式</li>
</ul>`,
      initialCode: '# Kibana KQL 查询\n',
      sampleData: ['Filter applied. Found 23 matching documents.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /service.*order-service/.test(normalized) &&
               /level.*error/.test(normalized) &&
               /level.*warn/.test(normalized) &&
               /\band\b/.test(normalized) &&
               /\bor\b/.test(normalized);
      },
      successMsg: 'KQL 是在 Kibana 中快速定位日志的关键技能！'
    },
    {
      id: 'elk-11',
      title: 'ELK 架构设计',
      difficulty: 'expert',
      xp: 200,
      instruction: `<h4>🎯 任务</h4>
<p>设计一个完整的 ELK 日志收集架构，写出各组件的配置：</p>
<ol>
<li>配置 <strong>Filebeat</strong> 收集 <code>/var/log/*.log</code> 发送到 Logstash</li>
<li>配置 <strong>Logstash</strong> 接收 Filebeat 数据，输出到 Elasticsearch</li>
<li>说明 <strong>Kibana</strong> 如何连接 Elasticsearch</li>
</ol>`,
      hint: 'Filebeat: filebeat.inputs -> output.logstash; Logstash: input.beats -> output.elasticsearch',
      theory: `<h4>ELK 架构全景</h4>
<p>完整的 ELK 日志系统架构：</p>
<pre># Filebeat（轻量日志采集器）
filebeat.inputs:
  - type: log
    paths:
      - /var/log/*.log
output.logstash:
  hosts: ["logstash:5044"]

# Logstash（日志处理引擎）
input {
  beats { port => 5044 }
}
filter {
  grok { ... }
}
output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{+YYYY.MM.dd}"
  }
}

# Kibana（可视化平台）
elasticsearch.hosts: ["http://elasticsearch:9200"]</pre>
<p>数据流向：App → Filebeat → Logstash → Elasticsearch → Kibana</p>
<p>也可以使用 Kafka 作为中间缓冲层。</p>`,
      initialCode: '# Filebeat 配置\n\n# Logstash 管道配置\n\n# Kibana 连接配置\n',
      sampleData: ['ELK pipeline configured successfully.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        const hasFilebeat = /filebeat/.test(normalized) && /\/var\/log/.test(normalized) && /logstash/.test(normalized);
        const hasLogstash = /input.*beats|beats.*port/.test(normalized) && /elasticsearch/.test(normalized);
        const hasKibana = /kibana/.test(normalized) || /elasticsearch\.hosts/.test(normalized);
        return hasFilebeat && hasLogstash && hasKibana;
      },
      successMsg: '你已掌握完整的 ELK 日志系统架构！所有世界探索完成！🎉'
    }
  ]
};