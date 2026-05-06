/**
 * Redis 世界 - 关卡数据
 * 从基础命令到高级数据结构和发布订阅
 */
const REDIS_LEVELS = {
  world: 'redis',
  name: 'Redis 缓存',
  icon: '🔴',
  description: '学习 Redis 内存数据库的核心操作，包括字符串、哈希、列表、集合、有序集合以及发布订阅和持久化。',
  color: '#ff5252',
  levels: [
    // ============ 初级 - 基础命令 ============
    {
      id: 'redis-01',
      title: 'SET 和 GET',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Redis 命令将 <code>name</code> 的值设置为 <code>"TechQuest"</code>，然后获取该值。</p>
<p>请写出这两条命令。</p>`,
      hint: 'SET key value 设置值，GET key 获取值',
      theory: `<h4>Redis 基础：String 类型</h4>
<p>Redis 最基本的数据类型是 String（字符串）。</p>
<pre>SET key value    -- 设置键值对
GET key          -- 获取值
DEL key          -- 删除键</pre>
<p>示例：</p>
<pre>SET name "TechQuest"
GET name          -- 返回 "TechQuest"</pre>
<p>Redis 是一个<strong>键值对</strong>存储系统，所有数据都以 key-value 形式存储。</p>`,
      initialCode: '-- 设置 name 的值为 TechQuest\n\n\n-- 获取 name 的值\n',
      sampleData: ['OK', '"TechQuest"'],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasSet = lines.some(l => /set\s+name\s+["']?techquest["']?/i.test(l.trim()));
        const hasGet = lines.some(l => /get\s+name/i.test(l.trim()));
        return hasSet && hasGet;
      },
      successMsg: 'SET/GET 是 Redis 最基础也是最常用的命令！'
    },
    {
      id: 'redis-02',
      title: '带过期时间的键',
      difficulty: 'easy',
      xp: 60,
      instruction: `<h4>🎯 任务</h4>
<p>设置一个键 <code>token</code> 值为 <code>"abc123"</code>，并设置 <strong>300秒</strong> 后自动过期。</p>
<p>用一条命令完成。</p>`,
      hint: 'SET key value EX seconds',
      theory: `<h4>设置过期时间</h4>
<p>Redis 支持为键设置自动过期，常用于缓存和会话管理。</p>
<pre>SET token "abc123" EX 300   -- 300秒后过期
EXPIRE key seconds          -- 为已有键设置过期
TTL key                     -- 查看剩余过期时间</pre>
<p>过期单位：</p>
<ul>
<li><code>EX</code> - 秒</li>
<li><code>PX</code> - 毫秒</li>
</ul>`,
      initialCode: '-- 设置 token，300秒后过期\n',
      sampleData: ['OK'],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /set\s+token\s+["']?abc123["']?\s+ex\s+300\s*;?\s*$/.test(normalized);
      },
      successMsg: '带过期时间的键是实现缓存、限流等功能的基础！'
    },
    {
      id: 'redis-03',
      title: 'HSET 哈希操作',
      difficulty: 'easy',
      xp: 70,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Redis 哈希命令存储一个用户信息：</p>
<ul>
<li>键：<code>user:1</code></li>
<li>字段 <code>name</code> = <code>"张三"</code></li>
<li>字段 <code>age</code> = <code>28</code></li>
<li>字段 <code>city</code> = <code>"北京"</code></li>
</ul>
<p>然后获取该用户的所有信息。</p>`,
      hint: 'HSET key field value [field value ...]，HGETALL key',
      theory: `<h4>Hash（哈希）类型</h4>
<p>Hash 是键值对的集合，适合存储对象：</p>
<pre>HSET user:1 name "张三" age 28 city "北京"
HGET user:1 name       -- 获取单个字段
HGETALL user:1         -- 获取所有字段和值
HDEL user:1 city       -- 删除字段</pre>
<p>Hash 比 String 存储对象更高效，可以只修改单个字段。</p>`,
      initialCode: '-- 存储用户信息\n\n\n-- 获取用户所有信息\n',
      sampleData: ['(integer) 3', ['name', '"张三"', 'age', '"28"', 'city', '"北京"']],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasHset = lines.some(l => /hset\s+user:1\s+.*name\s+["']张三["']/.test(l.trim()) && /age\s+28/.test(l.trim()) && /city\s+["']北京["']/.test(l.trim()));
        const hasHgetall = lines.some(l => /hgetall\s+user:1/i.test(l.trim()));
        return hasHset && hasHgetall;
      },
      successMsg: 'Hash 类型非常适合存储结构化数据，如用户信息、商品信息等！'
    },
    {
      id: 'redis-04',
      title: 'LPUSH 和 LRANGE 列表',
      difficulty: 'easy',
      xp: 70,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Redis 列表创建一个消息队列：</p>
<ol>
<li>向列表 <code>messages</code> 左侧依次推入 <code>"消息A"</code>、<code>"消息B"</code>、<code>"消息C"</code></li>
<li>获取列表中的所有元素</li>
</ol>`,
      hint: 'LPUSH key value，LRANGE key start stop（stop=-1 表示到最后）',
      theory: `<h4>List（列表）类型</h4>
<p>Redis 列表是有序的字符串链表：</p>
<pre>LPUSH list value      -- 从左侧推入
RPUSH list value      -- 从右侧推入
LPOP list             -- 从左侧弹出
RPOP list             -- 从右侧弹出
LRANGE list 0 -1      -- 获取所有元素</pre>
<p>List 常用于：消息队列、最新动态列表等。</p>`,
      initialCode: '-- 向列表推入消息\n\n\n-- 获取所有消息\n',
      sampleData: ['(integer) 3', ['消息C', '消息B', '消息A']],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasLpush = lines.some(l => /lpush\s+messages/i.test(l.trim()));
        const hasLrange = lines.some(l => /lrange\s+messages\s+0\s+-1/i.test(l.trim()));
        return hasLpush && hasLrange;
      },
      successMsg: 'List 的两端操作时间复杂度为 O(1)，非常适合用作队列或栈！'
    },
    // ============ 中级 - 集合与有序集合 ============
    {
      id: 'redis-05',
      title: 'SADD 集合操作',
      difficulty: 'medium',
      xp: 80,
      instruction: `<h4>🎯 任务</h4>
<p>用集合存储一组标签：</p>
<ol>
<li>向集合 <code>tags:post:1</code> 添加 <code>"redis"</code>、<code>"database"</code>、<code>"nosql"</code></li>
<li>判断 <code>"redis"</code> 是否在集合中</li>
</ol>`,
      hint: 'SADD key member，SISMEMBER key member',
      theory: `<h4>Set（集合）类型</h4>
<p>集合是<strong>无序</strong>且<strong>不重复</strong>的元素集合：</p>
<pre>SADD tags:post:1 "redis" "database" "nosql"
SISMEMBER tags:post:1 "redis"   -- 返回 1（存在）
SMEMBERS tags:post:1            -- 获取所有成员
SINTER set1 set2                -- 交集
SUNION set1 set2                -- 并集</pre>
<p>适用场景：标签系统、好友关系、去重等。</p>`,
      initialCode: '-- 添加标签\n\n\n-- 检查 redis 是否在集合中\n',
      sampleData: ['(integer) 3', '(integer) 1'],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasSadd = lines.some(l => /sadd\s+tags:post:1\s+.*redis.*database.*nosql/i.test(l.trim()) || /sadd\s+tags:post:1/i.test(l.trim()));
        const hasSismember = lines.some(l => /sismember\s+tags:post:1\s+["']?redis["']?/i.test(l.trim()));
        return hasSadd && hasSismember;
      },
      successMsg: '集合的去重特性和集合运算在很多场景下非常有用！'
    },
    {
      id: 'redis-06',
      title: 'ZADD 有序集合',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>使用有序集合存储游戏排行榜：</p>
<ol>
<li>向 <code>leaderboard</code> 添加：玩家 <code>"Alice"</code> 得分 <code>95</code>，玩家 <code>"Bob"</code> 得分 <code>87</code>，玩家 <code>"Charlie"</code> 得分 <code>92</code></li>
<li>按分数从高到低获取排名（带分数）</li>
</ol>`,
      hint: 'ZADD key score member，ZREVRANGE key start stop WITHSCORES',
      theory: `<h4>Sorted Set（有序集合）</h4>
<p>有序集合 = 集合 + 排序。每个元素关联一个分数（score）：</p>
<pre>ZADD leaderboard 95 "Alice" 87 "Bob" 92 "Charlie"
ZREVRANGE leaderboard 0 -1 WITHSCORES  -- 按分数降序
ZRANGE leaderboard 0 -1 WITHSCORES     -- 按分数升序
ZSCORE leaderboard "Alice"              -- 获取某个成员的分数</pre>
<p>适用场景：排行榜、优先队列、延时队列等。</p>`,
      initialCode: '-- 添加玩家分数\n\n\n-- 获取排行榜\n',
      sampleData: [
        ['1) "Alice"', '2) "95"', '3) "Charlie"', '4) "92"', '5) "Bob"', '6) "87"']
      ],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasZadd = lines.some(l => /zadd\s+leaderboard/i.test(l.trim()));
        const hasZrange = lines.some(l => /zrevrange\s+leaderboard\s+0\s+-1\s+withscores/i.test(l.trim()));
        return hasZadd && hasZrange;
      },
      successMsg: '有序集合是 Redis 最强大的数据类型之一，排行榜必备！'
    },
    {
      id: 'redis-07',
      title: 'INCR 原子计数',
      difficulty: 'medium',
      xp: 90,
      instruction: `<h4>🎯 任务</h4>
<p>实现一个页面访问计数器：</p>
<ol>
<li>将 <code>page:home:views</code> 的值增加 1（如果不存在，会自动创建并设为 0 然后加 1）</li>
<li>一次增加 10</li>
<li>获取当前计数值</li>
</ol>`,
      hint: 'INCR key，INCRBY key increment，GET key',
      theory: `<h4>原子操作：INCR</h4>
<p>Redis 的 INCR 操作是<strong>原子性</strong>的，在并发场景下安全：</p>
<pre>INCR counter           -- 加 1
INCRBY counter 10      -- 加 10
DECR counter           -- 减 1
DECRBY counter 5       -- 减 5</pre>
<p>适用场景：</p>
<ul>
<li>页面访问计数</li>
<li>点赞数统计</li>
<li>限流计数器</li>
<li>分布式 ID 生成</li>
</ul>`,
      initialCode: '-- 页面访问计数\n\n\n\n-- 获取当前计数\n',
      sampleData: ['(integer) 1', '(integer) 11', '11'],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasIncr = lines.some(l => /incr\s+page:home:views/i.test(l.trim()));
        const hasIncrby = lines.some(l => /incrby\s+page:home:views\s+10/i.test(l.trim()));
        const hasGet = lines.some(l => /get\s+page:home:views/i.test(l.trim()));
        return hasIncr && hasIncrby && hasGet;
      },
      successMsg: 'INCR 的原子性保证了在高并发下的数据安全！'
    },
    // ============ 高级 - 事务与发布订阅 ============
    {
      id: 'redis-08',
      title: 'MULTI 事务',
      difficulty: 'hard',
      xp: 120,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Redis 事务执行一组操作：</p>
<ol>
<li>开始事务</li>
<li>设置 <code>account:A</code> 余额为 <code>1000</code></li>
<li>设置 <code>account:B</code> 余额为 <code>500</code></li>
<li>执行事务</li>
</ol>`,
      hint: 'MULTI 开始事务，EXEC 执行事务',
      theory: `<h4>Redis 事务</h4>
<p>Redis 事务使用 <code>MULTI</code> / <code>EXEC</code> 包裹命令：</p>
<pre>MULTI
SET key1 value1
SET key2 value2
EXEC</pre>
<p>注意：</p>
<ul>
<li>事务中的命令按顺序执行，不会被其他命令打断</li>
<li>不支持回滚（与关系型数据库不同）</li>
<li><code>DISCARD</code> 可以取消事务</li>
</ul>`,
      initialCode: '-- 使用事务设置账户余额\n',
      sampleData: ['OK', 'QUEUED', 'QUEUED', ['OK', 'OK']],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /multi/.test(normalized) &&
               /set\s+account:a\s+1000/.test(normalized) &&
               /set\s+account:b\s+500/.test(normalized) &&
               /exec/.test(normalized);
      },
      successMsg: 'Redis 事务保证了命令的顺序执行！'
    },
    {
      id: 'redis-09',
      title: 'PUB/SUB 发布订阅',
      difficulty: 'hard',
      xp: 130,
      instruction: `<h4>🎯 任务</h4>
<p>实现消息发布订阅：</p>
<ol>
<li>向频道 <code>news</code> 发布消息 <code>"Redis 7.0 发布啦！"</code></li>
<li>订阅频道 <code>news</code></li>
</ol>`,
      hint: 'PUBLISH channel message，SUBSCRIBE channel',
      theory: `<h4>Pub/Sub 发布订阅</h4>
<p>Redis 支持发布/订阅消息模式：</p>
<pre>SUBSCRIBE news           -- 订阅频道
PUBLISH news "消息内容"  -- 发布消息</pre>
<p>特点：</p>
<ul>
<li>消息不持久化，发布时没有订阅者则丢失</li>
<li>支持模式匹配：<code>PSUBSCRIBE news.*</code></li>
<li>常用于实时通知、事件广播</li>
</ul>
<p>对于需要持久化的消息，请使用 Redis Streams 或 Kafka。</p>`,
      initialCode: '-- 发布消息到 news 频道\n\n\n-- 订阅 news 频道\n',
      sampleData: ['(integer) 1', ['news', 'Redis 7.0 发布啦！']],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasPublish = lines.some(l => /publish\s+news\s+["']Redis\s*7\.0\s*发布啦!["']/i.test(l.trim()));
        const hasSubscribe = lines.some(l => /subscribe\s+news/i.test(l.trim()));
        return hasPublish && hasSubscribe;
      },
      successMsg: '发布订阅是构建实时系统的基础模式！'
    },
    // ============ 专家级 - 持久化与高级场景 ============
    {
      id: 'redis-10',
      title: 'Pipeline 批量操作',
      difficulty: 'expert',
      xp: 150,
      instruction: `<h4>🎯 任务</h4>
<p>使用 Pipeline 批量设置 5 个键值对：</p>
<p><code>key1=val1</code>, <code>key2=val2</code>, <code>key3=val3</code>, <code>key4=val4</code>, <code>key5=val5</code></p>
<p>然后批量获取所有值。</p>
<p>注意：Pipeline 在命令行中用多个 SET 命令连续执行（不用等回复），再用 MGET 批量获取。</p>`,
      hint: '在命令行工具中，用 MULTI/EXEC 或直接连续 SET，然后 MGET key1 key2 ... 批量获取',
      theory: `<h4>Pipeline 批量操作</h4>
<p>Pipeline 减少网络往返次数，提高批量操作效率：</p>
<pre>-- 普通方式：5次网络往返
SET key1 val1
SET key2 val2
...

-- Pipeline：1次网络往返
MSET key1 val1 key2 val2 key3 val3 key4 val4 key5 val5

-- 批量获取
MGET key1 key2 key3 key4 key5</pre>
<p><code>MSET</code> 和 <code>MGET</code> 是 Redis 提供的批量操作命令。</p>`,
      initialCode: '-- 批量设置\n\n\n-- 批量获取\n',
      sampleData: ['OK', ['val1', 'val2', 'val3', 'val4', 'val5']],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        const hasMset = /mset\s+key1\s+val1\s+key2\s+val2\s+key3\s+val3\s+key4\s+val4\s+key5\s+val5/.test(normalized);
        const hasMget = /mget\s+key1\s+key2\s+key3\s+key4\s+key5/.test(normalized);
        return hasMset && hasMget;
      },
      successMsg: '批量操作大幅提升了 Redis 的吞吐量！'
    },
    {
      id: 'redis-11',
      title: '缓存策略：缓存穿透',
      difficulty: 'expert',
      xp: 180,
      instruction: `<h4>🎯 任务</h4>
<p>实现一个简单的缓存查询逻辑：</p>
<ol>
<li>尝试从缓存 <code>cache:user:999</code> 获取数据</li>
<li>如果缓存不存在，设置一个空值 <code>"NULL"</code> 并设置 60 秒过期（防止缓存穿透）</li>
</ol>`,
      hint: 'GET key，如果返回 nil，则 SET key "NULL" EX 60',
      theory: `<h4>缓存穿透防护</h4>
<p><strong>缓存穿透</strong>：查询一个一定不存在的数据，缓存和数据库都查不到。</p>
<p>解决方案之一：<strong>缓存空值</strong></p>
<pre>-- 查询缓存
GET cache:user:999

-- 如果返回 nil，缓存空值
SET cache:user:999 "NULL" EX 60</pre>
<p>其他方案：</p>
<ul>
<li>布隆过滤器（Bloom Filter）</li>
<li>参数校验</li>
</ul>`,
      initialCode: '-- 第一步：查询缓存\n\n\n-- 第二步：缓存空值（假设查询结果为空）\n',
      sampleData: ['(nil)', 'OK'],
      validator: (code) => {
        const lines = code.trim().split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));
        const hasGet = lines.some(l => /get\s+cache:user:999/i.test(l.trim()));
        const hasSet = lines.some(l => /set\s+cache:user:999\s+["']?null["']?\s+ex\s+60/i.test(l.trim()));
        return hasGet && hasSet;
      },
      successMsg: '理解缓存策略是后端工程师的必备技能！Redis 世界探索完成！'
    }
  ]
};