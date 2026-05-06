/**
 * Kafka 世界 - 关卡数据
 * 从基础概念到高级消费者组和流处理
 */
const KAFKA_LEVELS = {
  world: 'kafka',
  name: 'Kafka 消息队列',
  icon: '📨',
  description: '掌握 Apache Kafka 分布式消息系统的核心概念，学习生产者、消费者、Topic 管理、消费者组和流处理。',
  color: '#ffab40',
  levels: [
    // ============ 初级 - 基础概念 ============
    {
      id: 'kafka-01',
      title: '创建 Topic',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Kafka CLI 创建一个 Topic：</p>
<ul>
<li>Topic 名称：<code>user-events</code></li>
<li>分区数：<code>3</code></li>
<li>副本数：<code>1</code></li>
</ul>`,
      hint: 'kafka-topics.sh --create --topic 名称 --partitions 数量 --replication-factor 数量 --bootstrap-server localhost:9092',
      theory: `<h4>Kafka 基础概念</h4>
<p><strong>Topic</strong> 是 Kafka 中消息的逻辑分类。</p>
<ul>
<li><strong>Partition（分区）</strong>：Topic 的物理分区，实现并行处理</li>
<li><strong>Replication（副本）</strong>：数据冗余，保证高可用</li>
</ul>
<pre>kafka-topics.sh --create \\
  --topic user-events \\
  --partitions 3 \\
  --replication-factor 1 \\
  --bootstrap-server localhost:9092</pre>
<p>一个 Topic 可以有多个分区，每个分区可以有多个副本。</p>`,
      initialCode: '# 创建 Topic: user-events\n',
      sampleData: ['Created topic user-events.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-topics\.sh\s+--create/.test(normalized) &&
               /--topic\s+user-events/.test(normalized) &&
               /--partitions\s+3/.test(normalized) &&
               /--replication-factor\s+1/.test(normalized);
      },
      successMsg: 'Topic 创建成功！这是使用 Kafka 的第一步。'
    },
    {
      id: 'kafka-02',
      title: '生产消息',
      difficulty: 'easy',
      xp: 60,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Kafka 控制台生产者向 <code>user-events</code> Topic 发送消息：</p>
<ul>
<li>消息内容：<code>{"user":"alice","action":"login"}</code></li>
</ul>
<p>写出启动控制台生产者并发送该消息的命令。</p>`,
      hint: 'kafka-console-producer.sh --topic user-events --bootstrap-server localhost:9092',
      theory: `<h4>Producer（生产者）</h4>
<p>生产者负责将消息发送到 Kafka Topic。</p>
<pre>kafka-console-producer.sh \\
  --topic user-events \\
  --bootstrap-server localhost:9092

# 然后在交互界面输入消息：
> {"user":"alice","action":"login"}</pre>
<p>生产者核心配置：</p>
<ul>
<li><code>acks</code>：确认机制（0, 1, all）</li>
<li><code>retries</code>：重试次数</li>
<li><code>batch.size</code>：批处理大小</li>
</ul>`,
      initialCode: '# 启动控制台生产者\n\n# 发送消息（在生产者交互界面输入）\n# > ',
      sampleData: ['[2024-01-01 10:00:00] Sending message...'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        const hasProducer = /kafka-console-producer\.sh\s+--topic\s+user-events/.test(normalized) ||
                           /kafka-console-producer\.sh.*--topic\s+user-events/.test(normalized);
        const hasMsg = /user.*alice.*action.*login/i.test(normalized);
        return hasProducer && hasMsg;
      },
      successMsg: '消息已发送到 Kafka！生产者是数据流入 Kafka 的入口。'
    },
    {
      id: 'kafka-03',
      title: '消费消息',
      difficulty: 'easy',
      xp: 60,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Kafka 控制台消费者从 <code>user-events</code> Topic 消费消息：</p>
<ul>
<li>从<strong>最早</strong>的消息开始消费</li>
</ul>`,
      hint: 'kafka-console-consumer.sh --topic user-events --from-beginning --bootstrap-server localhost:9092',
      theory: `<h4>Consumer（消费者）</h4>
<p>消费者从 Topic 中读取消息：</p>
<pre>kafka-console-consumer.sh \\
  --topic user-events \\
  --from-beginning \\
  --bootstrap-server localhost:9092</pre>
<p>关键参数：</p>
<ul>
<li><code>--from-beginning</code>：从头开始消费（包括历史消息）</li>
<li>不加此参数：只消费新产生的消息</li>
</ul>
<p>每个消费者属于一个<strong>消费者组</strong>。</p>`,
      initialCode: '# 启动控制台消费者，从头开始消费\n',
      sampleData: ['{"user":"alice","action":"login"}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-console-consumer\.sh\s+--topic\s+user-events/.test(normalized) &&
               /--from-beginning/.test(normalized);
      },
      successMsg: '消费者成功读取了消息！消息的生产和消费是 Kafka 的核心。'
    },
    {
      id: 'kafka-04',
      title: '查看 Topic 信息',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>写出查看 <code>user-events</code> Topic 详细信息的命令。</p>`,
      hint: 'kafka-topics.sh --describe --topic user-events --bootstrap-server localhost:9092',
      theory: `<h4>Topic 管理</h4>
<p>查看 Topic 列表和详细信息：</p>
<pre># 列出所有 Topic
kafka-topics.sh --list --bootstrap-server localhost:9092

# 查看 Topic 详情
kafka-topics.sh --describe \\
  --topic user-events \\
  --bootstrap-server localhost:9092</pre>
<p>详细信息包括：</p>
<ul>
<li>分区数量和分布</li>
<li>副本分配</li>
<li>Leader 节点</li>
</ul>`,
      initialCode: '# 查看 Topic 详细信息\n',
      sampleData: ['Topic: user-events  PartitionCount: 3  ReplicationFactor: 1'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-topics\.sh\s+--describe/.test(normalized) &&
               /--topic\s+user-events/.test(normalized);
      },
      successMsg: '掌握 Topic 管理命令是 Kafka 运维的基础！'
    },
    // ============ 中级 - 消费者组与偏移量 ============
    {
      id: 'kafka-05',
      title: '消费者组',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>使用控制台消费者加入消费者组 <code>analytics-group</code>，消费 <code>user-events</code> Topic。</p>`,
      hint: 'kafka-console-consumer.sh --topic user-events --group analytics-group --bootstrap-server localhost:9092',
      theory: `<h4>消费者组（Consumer Group）</h4>
<p>消费者组是 Kafka 实现负载均衡的核心机制：</p>
<pre>kafka-console-consumer.sh \\
  --topic user-events \\
  --group analytics-group \\
  --bootstrap-server localhost:9092</pre>
<p>核心规则：</p>
<ul>
<li>同一消费者组内，每个分区只被一个消费者消费</li>
<li>不同消费者组之间互不影响</li>
<li>消费者数 ≤ 分区数（多余的消费者会闲置）</li>
</ul>
<p>这是 Kafka 实现水平扩展的关键。</p>`,
      initialCode: '# 加入消费者组\n',
      sampleData: ['[Consumer clientId=consumer-analytics-group-1, groupId=analytics-group] Joined group'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-console-consumer\.sh.*--topic\s+user-events/.test(normalized) &&
               /--group\s+analytics-group/.test(normalized);
      },
      successMsg: '消费者组让 Kafka 具备了水平扩展消费能力！'
    },
    {
      id: 'kafka-06',
      title: '管理消费者组偏移量',
      difficulty: 'medium',
      xp: 110,
      instruction: `<h4>🎯 任务</h4>
<p>写出查看消费者组 <code>analytics-group</code> 偏移量信息的命令。</p>`,
      hint: 'kafka-consumer-groups.sh --describe --group analytics-group --bootstrap-server localhost:9092',
      theory: `<h4>偏移量（Offset）管理</h4>
<p>偏移量记录消费者在每个分区中的消费位置：</p>
<pre>kafka-consumer-groups.sh \\
  --describe \\
  --group analytics-group \\
  --bootstrap-server localhost:9092</pre>
<p>输出包含：</p>
<ul>
<li><code>TOPIC</code>：Topic 名称</li>
<li><code>PARTITION</code>：分区编号</li>
<li><code>CURRENT-OFFSET</code>：当前消费位移</li>
<li><code>LOG-END-OFFSET</code>：最新消息位移</li>
<li><code>LAG</code>：消费延迟（堆积量）</li>
</ul>
<p><code>LAG</code> 是监控消费能力的关键指标。</p>`,
      initialCode: '# 查看消费者组偏移量\n',
      sampleData: ['GROUP           TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-consumer-groups\.sh\s+--describe/.test(normalized) &&
               /--group\s+analytics-group/.test(normalized);
      },
      successMsg: '掌握偏移量管理，就能监控和诊断消费问题！'
    },
    {
      id: 'kafka-07',
      title: '自定义分区策略',
      difficulty: 'medium',
      xp: 110,
      instruction: `<h4>🎯 任务</h4>
<p>生产消息时指定 key，让相同 key 的消息发送到同一个分区：</p>
<p>向 <code>user-events</code> 发送两条消息，key 为 <code>alice</code>，value 分别为 <code>"login"</code> 和 <code>"purchase"</code>。</p>
<p>使用控制台生产者的 <code>--property parse.key=true</code> 和 <code>--property key.separator=:</code>。</p>`,
      hint: 'kafka-console-producer.sh --topic user-events --property parse.key=true --property key.separator=: --bootstrap-server localhost:9092',
      theory: `<h4>消息分区策略</h4>
<p>消息的 key 决定它被分配到哪个分区：</p>
<pre>kafka-console-producer.sh \\
  --topic user-events \\
  --property parse.key=true \\
  --property key.separator=: \\
  --bootstrap-server localhost:9092

# 输入（key:value 格式）：
> alice:login
> alice:purchase</pre>
<p>相同 key 的消息会被发送到同一个分区，保证顺序性。</p>
<p>不指定 key 则默认轮询分配。</p>`,
      initialCode: '# 启动带 key 的生产者\n\n# 发送消息（key:value 格式）\n# > \n# > ',
      sampleData: ['>> alice:login', '>> alice:purchase'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\\\s+/g, '');
        return /kafka-console-producer\.sh.*--topic\s+user-events/.test(normalized) &&
               /parse\.key\s*=\s*true/.test(normalized) &&
               /alice.*login/i.test(normalized) &&
               /alice.*purchase/i.test(normalized);
      },
      successMsg: '通过 key 实现的分区策略保证了消息的有序性！'
    },
    // ============ 高级 - 高级特性 ============
    {
      id: 'kafka-08',
      title: '消费者 Rebalance 理解',
      difficulty: 'hard',
      xp: 130,
      instruction: `<h4>🎯 任务</h4>
<p>写出一个消费者配置，设置以下参数：</p>
<ul>
<li>消费者组 ID：<code>order-processor</code></li>
<li>自动提交偏移量：<code>false</code>（手动提交）</li>
<li>自动偏移重置策略：<code>earliest</code></li>
</ul>
<p>使用 Java Properties 配置格式。</p>`,
      hint: 'put("group.id", "order-processor"), put("enable.auto.commit", "false"), put("auto.offset.reset", "earliest")',
      theory: `<h4>消费者配置与 Rebalance</h4>
<p>关键消费者配置：</p>
<pre>Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "order-processor");
props.put("enable.auto.commit", "false");
props.put("auto.offset.reset", "earliest");
props.put("key.deserializer", 
  "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", 
  "org.apache.kafka.common.serialization.StringDeserializer");</pre>
<p><strong>Rebalance</strong> 在以下情况触发：</p>
<ul>
<li>消费者加入/离开组</li>
<li>Topic 分区数变化</li>
</ul>
<p><code>auto.offset.reset</code>：</p>
<ul>
<li><code>earliest</code>：从最早消息开始</li>
<li><code>latest</code>：从最新消息开始</li>
<li><code>none</code>：抛出异常</li>
</ul>`,
      initialCode: '// 配置消费者\nProperties props = new Properties();\nprops.put("bootstrap.servers", "localhost:9092");\n',
      sampleData: ['Consumer configured successfully.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /group\.id.*order-processor/.test(normalized) &&
               /enable\.auto\.commit.*false/.test(normalized) &&
               /auto\.offset\.reset.*earliest/.test(normalized);
      },
      successMsg: '正确的消费者配置是构建可靠消费系统的基础！'
    },
    {
      id: 'kafka-09',
      title: 'Exactly-Once 语义',
      difficulty: 'hard',
      xp: 150,
      instruction: `<h4>🎯 任务</h4>
<p>写出生产者配置以实现精确一次（Exactly-Once）语义：</p>
<ul>
<li>设置 <code>acks</code> 为 <code>all</code></li>
<li>启用幂等性：<code>enable.idempotence</code> 为 <code>true</code></li>
<li>设置事务 ID：<code>transactional.id</code> 为 <code>"tx-order-001"</code></li>
</ul>`,
      hint: 'put("acks", "all"), put("enable.idempotence", "true"), put("transactional.id", "tx-order-001")',
      theory: `<h4>Exactly-Once 语义</h4>
<p>Kafka 支持三种消息语义：</p>
<ul>
<li><strong>At-most-once</strong>：消息可能丢失</li>
<li><strong>At-least-once</strong>：消息可能重复</li>
<li><strong>Exactly-once</strong>：消息恰好处理一次</li>
</ul>
<pre>// Exactly-Once 生产者配置
props.put("acks", "all");
props.put("enable.idempotence", "true");
props.put("transactional.id", "tx-order-001");</pre>
<p>生产者初始化事务：</p>
<pre>producer.initTransactions();
producer.beginTransaction();
// 发送消息...
producer.commitTransaction();</pre>`,
      initialCode: '// Exactly-Once 配置\nProperties props = new Properties();\nprops.put("bootstrap.servers", "localhost:9092");\n',
      sampleData: ['Producer configured for Exactly-Once semantics.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /acks.*all/.test(normalized) &&
               /enable\.idempotence.*true/.test(normalized) &&
               /transactional\.id.*tx-order-001/.test(normalized);
      },
      successMsg: 'Exactly-Once 是金融级应用的关键保障！'
    },
    // ============ 专家级 - 流处理与架构 ============
    {
      id: 'kafka-10',
      title: 'Kafka Streams 基础',
      difficulty: 'expert',
      xp: 180,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Kafka Streams API 编写一个简单的流处理程序：</p>
<ol>
<li>从 Topic <code>input-topic</code> 读取消息</li>
<li>将消息值转为大写</li>
<li>写入 Topic <code>output-topic</code></li>
</ol>
<p>使用 Streams DSL 写出核心代码。</p>`,
      hint: 'StreamsBuilder().stream("input-topic").mapValues(v -> v.toUpperCase()).to("output-topic")',
      theory: `<h4>Kafka Streams</h4>
<p>Kafka Streams 是一个客户端库，用于构建流处理应用：</p>
<pre>StreamsBuilder builder = new StreamsBuilder();

builder.stream("input-topic")
  .mapValues(v -> v.toUpperCase())
  .to("output-topic");

KafkaStreams streams = new KafkaStreams(
  builder.build(), config);
streams.start();</pre>
<p>核心概念：</p>
<ul>
<li><strong>Stream</strong>：无界数据流</li>
<li><strong>Table</strong>：变更日志的最新状态</li>
<li><strong>KStream / KTable</strong>：流和表的抽象</li>
</ul>
<p>常见操作：<code>map</code>, <code>filter</code>, <code>groupBy</code>, <code>aggregate</code>, <code>join</code></p>`,
      initialCode: '// Kafka Streams 处理流\nStreamsBuilder builder = new StreamsBuilder();\n\n',
      sampleData: ['Stream processing started.'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /stream\s*\(\s*["']input-topic["']\s*\)/.test(normalized) &&
               /touppercase\s*\(\s*\)/.test(normalized) &&
               /to\s*\(\s*["']output-topic["']\s*\)/.test(normalized);
      },
      successMsg: 'Kafka Streams 让你可以在 Kafka 内部实现数据的实时处理！'
    },
    {
      id: 'kafka-11',
      title: '连接器配置 (Connector)',
      difficulty: 'expert',
      xp: 180,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Kafka Connect REST API 配置一个 Source Connector：</p>
<ul>
<li>连接器名称：<code>file-source</code></li>
<li>连接器类：<code>FileStreamSource</code></li>
<li>要监控的文件：<code>/tmp/input.txt</code></li>
<li>目标 Topic：<code>file-data</code></li>
</ul>
<p>写出 REST API 的 JSON 配置。</p>`,
      hint: 'POST /connectors，JSON 格式配置 name, config.connector.class, config.file, config.topic',
      theory: `<h4>Kafka Connect</h4>
<p>Kafka Connect 是一个框架，用于在 Kafka 和外部系统之间传输数据：</p>
<pre>POST /connectors HTTP/1.1
Content-Type: application/json

{
  "name": "file-source",
  "config": {
    "connector.class": 
      "FileStreamSource",
    "file": "/tmp/input.txt",
    "topic": "file-data"
  }
}</pre>
<p>两种连接器类型：</p>
<ul>
<li><strong>Source Connector</strong>：从外部系统导入数据到 Kafka</li>
<li><strong>Sink Connector</strong>：从 Kafka 导出数据到外部系统</li>
</ul>
<p>常见连接器：JDBC、Elasticsearch、S3、HDFS 等。</p>`,
      initialCode: '// Kafka Connect REST API 配置\n{\n  "name": "file-source",\n  "config": {\n',
      sampleData: ['{"name":"file-source","tasks":["0"],"type":"source"}'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /connector\.class.*filestreamsource/.test(normalized) &&
               /file.*\/tmp\/input\.txt/.test(normalized) &&
               /topic.*file-data/.test(normalized);
      },
      successMsg: 'Kafka Connect 让数据集成变得简单！Kafka 世界探索完成！'
    }
  ]
};