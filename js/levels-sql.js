/**
 * SQL 世界 - 关卡数据
 * 从基础 SELECT 到高级窗口函数，循序渐进
 */
const SQL_LEVELS = {
  world: 'sql',
  name: 'SQL 数据库',
  icon: '🗃️',
  description: '从零开始掌握 SQL 查询语言，学习数据的增删改查、表连接、子查询和高级分析函数。',
  color: '#4fc3f7',
  levels: [
    // ============ 初级 - 基础查询 ============
    {
      id: 'sql-01',
      title: '初识 SELECT',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>写一条 SQL 语句，从 <code>employees</code> 表中查询<strong>所有</strong>员工的信息。</p>
<h4>📋 数据表结构</h4>
<table class="example-table">
<tr><th>列名</th><th>类型</th><th>说明</th></tr>
<tr><td>id</td><td>INT</td><td>员工编号</td></tr>
<tr><td>name</td><td>VARCHAR</td><td>员工姓名</td></tr>
<tr><td>department</td><td>VARCHAR</td><td>部门</td></tr>
<tr><td>salary</td><td>DECIMAL</td><td>薪资</td></tr>
</table>`,
      hint: '使用 SELECT * FROM 表名 来查询所有列',
      theory: `<h4>SELECT 语句基础</h4>
<p><code>SELECT</code> 是 SQL 中最常用的语句，用于从数据库中检索数据。</p>
<p>基本语法：</p>
<pre>SELECT 列名 FROM 表名;</pre>
<p>要查询所有列，使用通配符 <code>*</code>：</p>
<pre>SELECT * FROM 表名;</pre>`,
      initialCode: '-- 查询 employees 表中的所有员工信息\n\n',
      sampleData: [
        { id: 1, name: '张三', department: '技术部', salary: 15000 },
        { id: 2, name: '李四', department: '市场部', salary: 12000 },
        { id: 3, name: '王五', department: '技术部', salary: 18000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /select\s+\*\s+from\s+employees\s*;?\s*$/.test(normalized);
      },
      successMsg: '你已成功查询所有数据！SELECT * 是最基础的查询方式。'
    },
    {
      id: 'sql-02',
      title: '指定列查询',
      difficulty: 'easy',
      xp: 50,
      instruction: `<h4>🎯 任务</h4>
<p>从 <code>employees</code> 表中只查询员工的 <code>name</code>（姓名）和 <code>salary</code>（薪资）两列。</p>
<h4>📋 数据表</h4>
<p>同上一关：employees (id, name, department, salary)</p>`,
      hint: '在 SELECT 后面列出你需要的列名，用逗号分隔',
      theory: `<h4>选择特定列</h4>
<p>实际开发中，通常只需要查询部分列，而不是所有列。</p>
<p>语法：</p>
<pre>SELECT 列名1, 列名2 FROM 表名;</pre>
<p>这样做的好处：</p>
<ul>
<li>提高查询性能</li>
<li>只获取需要的数据</li>
<li>代码更清晰</li>
</ul>`,
      initialCode: '-- 查询员工的姓名和薪资\nSELECT \n',
      sampleData: [
        { name: '张三', salary: 15000 },
        { name: '李四', salary: 12000 },
        { name: '王五', salary: 18000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /select\s+name\s*,\s*salary\s+from\s+employees\s*;?\s*$/.test(normalized) ||
               /select\s+salary\s*,\s*name\s+from\s+employees\s*;?\s*$/.test(normalized);
      },
      successMsg: '精确选择需要的列，是编写高效 SQL 的好习惯！'
    },
    {
      id: 'sql-03',
      title: 'WHERE 条件过滤',
      difficulty: 'easy',
      xp: 60,
      instruction: `<h4>🎯 任务</h4>
<p>从 <code>employees</code> 表中查询薪资 <strong>大于 15000</strong> 的员工姓名和薪资。</p>`,
      hint: '使用 WHERE 子句添加条件：WHERE 列名 > 值',
      theory: `<h4>WHERE 子句</h4>
<p><code>WHERE</code> 用于过滤满足条件的记录。</p>
<pre>SELECT 列名 FROM 表名 WHERE 条件;</pre>
<p>常用比较运算符：</p>
<ul>
<li><code>=</code> 等于</li>
<li><code>!=</code> 或 <code><></code> 不等于</li>
<li><code>></code> 大于</li>
<li><code><</code> 小于</li>
<li><code>>=</code> 大于等于</li>
<li><code><=</code> 小于等于</li>
</ul>`,
      initialCode: '-- 查询薪资大于 15000 的员工\nSELECT name, salary\nFROM employees\n',
      sampleData: [
        { name: '王五', salary: 18000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /select\s+name\s*,\s*salary\s+from\s+employees\s+where\s+salary\s*>\s*15000\s*;?\s*$/.test(normalized);
      },
      successMsg: 'WHERE 是数据过滤的核心，你已掌握！'
    },
    {
      id: 'sql-04',
      title: '多条件查询 (AND / OR)',
      difficulty: 'easy',
      xp: 70,
      instruction: `<h4>🎯 任务</h4>
<p>查询 <code>employees</code> 表中 <strong>技术部</strong> 且薪资 <strong>大于 15000</strong> 的员工姓名和部门。</p>`,
      hint: '使用 AND 连接两个条件',
      theory: `<h4>组合条件</h4>
<p>使用 <code>AND</code> 和 <code>OR</code> 组合多个条件：</p>
<pre>SELECT * FROM 表名
WHERE 条件1 AND 条件2;</pre>
<ul>
<li><code>AND</code>：两个条件都满足</li>
<li><code>OR</code>：满足其中一个即可</li>
</ul>
<p>可以用括号 <code>()</code> 来明确优先级。</p>`,
      initialCode: '-- 查询技术部且薪资大于15000的员工\nSELECT name, department\nFROM employees\n',
      sampleData: [
        { name: '王五', department: '技术部' }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        const hasSelect = /select\s+name\s*,\s*department\s+from\s+employees\s+where/.test(normalized);
        const hasDept = /department\s*=\s*'技术部'/.test(normalized) || /department\s*=\s*\"技术部\"/.test(normalized);
        const hasSalary = /salary\s*>\s*15000/.test(normalized);
        const hasAnd = /\band\b/.test(normalized);
        return hasSelect && hasDept && hasSalary && hasAnd;
      },
      successMsg: '多条件组合查询是日常开发中最常用的操作之一！'
    },
    // ============ 中级 - 排序、聚合 ============
    {
      id: 'sql-05',
      title: 'ORDER BY 排序',
      difficulty: 'medium',
      xp: 80,
      instruction: `<h4>🎯 任务</h4>
<p>查询所有员工信息，按薪资<strong>从高到低</strong>排序。</p>`,
      hint: '使用 ORDER BY 列名 DESC 进行降序排序',
      theory: `<h4>ORDER BY 排序</h4>
<p><code>ORDER BY</code> 用于对结果集进行排序：</p>
<pre>SELECT * FROM 表名 ORDER BY 列名 ASC;  -- 升序（默认）
SELECT * FROM 表名 ORDER BY 列名 DESC; -- 降序</pre>
<p>还可以多列排序：</p>
<pre>ORDER BY 列1 DESC, 列2 ASC</pre>`,
      initialCode: '-- 按薪资从高到低排序\n',
      sampleData: [
        { id: 3, name: '王五', department: '技术部', salary: 18000 },
        { id: 1, name: '张三', department: '技术部', salary: 15000 },
        { id: 2, name: '李四', department: '市场部', salary: 12000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /select\s+\*\s+from\s+employees\s+order\s+by\s+salary\s+desc\s*;?\s*$/.test(normalized);
      },
      successMsg: '排序功能让数据展示更有条理！'
    },
    {
      id: 'sql-06',
      title: 'GROUP BY 分组聚合',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>查询每个<strong>部门</strong>的<strong>平均薪资</strong>，显示部门名和平均薪资。</p>`,
      hint: '使用 GROUP BY 分组，AVG() 计算平均值',
      theory: `<h4>聚合函数与 GROUP BY</h4>
<p>聚合函数对一组值执行计算并返回单个值：</p>
<ul>
<li><code>COUNT()</code> - 计数</li>
<li><code>SUM()</code> - 求和</li>
<li><code>AVG()</code> - 平均值</li>
<li><code>MAX()</code> - 最大值</li>
<li><code>MIN()</code> - 最小值</li>
</ul>
<pre>SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department;</pre>
<p><code>GROUP BY</code> 将数据按指定列分组，然后对每组应用聚合函数。</p>`,
      initialCode: '-- 查询每个部门的平均薪资\nSELECT department, \n',
      sampleData: [
        { department: '技术部', avg_salary: 16500 },
        { department: '市场部', avg_salary: 12000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        const hasGroupBy = /group\s+by\s+department/.test(normalized);
        const hasAvg = /avg\s*\(\s*salary\s*\)/.test(normalized);
        const hasSelect = /select\s+department/.test(normalized);
        return hasGroupBy && hasAvg && hasSelect;
      },
      successMsg: '聚合分析是数据统计的利器！'
    },
    {
      id: 'sql-07',
      title: 'HAVING 过滤分组',
      difficulty: 'medium',
      xp: 100,
      instruction: `<h4>🎯 任务</h4>
<p>查询员工数量 <strong>大于 2</strong> 的部门及其员工数量。</p>
<p>使用 <code>employees</code> 表，列：<code>id, name, department, salary</code></p>`,
      hint: '先 GROUP BY 分组，再用 HAVING 过滤分组结果',
      theory: `<h4>HAVING vs WHERE</h4>
<ul>
<li><code>WHERE</code>：在分组<strong>前</strong>过滤行</li>
<li><code>HAVING</code>：在分组<strong>后</strong>过滤组</li>
</ul>
<pre>SELECT department, COUNT(*) as cnt
FROM employees
GROUP BY department
HAVING COUNT(*) > 2;</pre>
<p>记住：<code>HAVING</code> 必须跟在 <code>GROUP BY</code> 后面，用来过滤聚合结果。</p>`,
      initialCode: '-- 查询员工数大于2的部门\nSELECT department, COUNT(*) as cnt\nFROM employees\n',
      sampleData: [
        { department: '技术部', cnt: 3 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /group\s+by\s+department/.test(normalized) &&
               /having\s+count\s*\(\s*\*?\s*\)\s*>\s*2/.test(normalized);
      },
      successMsg: 'HAVING 让你能够过滤聚合后的结果，非常实用！'
    },
    // ============ 高级 - JOIN 连接 ============
    {
      id: 'sql-08',
      title: 'INNER JOIN 内连接',
      difficulty: 'hard',
      xp: 120,
      instruction: `<h4>🎯 任务</h4>
<p>查询每位员工的姓名及其所在部门名称。</p>
<p>使用两张表：</p>
<table class="example-table">
<tr><th>employees</th><th>departments</th></tr>
<tr><td>id, name, dept_id, salary</td><td>id, dept_name</td></tr>
</table>
<p>通过 <code>employees.dept_id = departments.id</code> 连接。</p>`,
      hint: '使用 INNER JOIN ... ON 来连接两张表',
      theory: `<h4>INNER JOIN（内连接）</h4>
<p><code>INNER JOIN</code> 返回两张表中满足连接条件的记录：</p>
<pre>SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;</pre>
<p>只返回两个表中都匹配的行。没有匹配的行会被排除。</p>
<p><code>e</code> 和 <code>d</code> 是表的<strong>别名</strong>，让代码更简洁。</p>`,
      initialCode: '-- 查询员工姓名和部门名称\nSELECT e.name, d.dept_name\nFROM employees e\n',
      sampleData: [
        { name: '张三', dept_name: '技术部' },
        { name: '李四', dept_name: '市场部' },
        { name: '王五', dept_name: '技术部' }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /inner\s+join\s+departments\s+d\s+on\s+e\.dept_id\s*=\s*d\.id/.test(normalized) ||
               /join\s+departments\s+d\s+on\s+e\.dept_id\s*=\s*d\.id/.test(normalized);
      },
      successMsg: 'JOIN 是关系型数据库的核心能力，你已跨入高级查询的大门！'
    },
    {
      id: 'sql-09',
      title: 'LEFT JOIN 左连接',
      difficulty: 'hard',
      xp: 130,
      instruction: `<h4>🎯 任务</h4>
<p>查询所有部门及其员工数量（包括没有员工的部门）。</p>
<table class="example-table">
<tr><th>departments</th><th>employees</th></tr>
<tr><td>id, dept_name</td><td>id, name, dept_id</td></tr>
</table>`,
      hint: 'LEFT JOIN 保留左表（departments）的所有记录，没有匹配时结果为 NULL',
      theory: `<h4>LEFT JOIN（左连接）</h4>
<p><code>LEFT JOIN</code> 返回左表的<strong>所有</strong>记录，即使右表中没有匹配：</p>
<pre>SELECT d.dept_name, COUNT(e.id) as emp_count
FROM departments d
LEFT JOIN employees e ON d.id = e.dept_id
GROUP BY d.dept_name;</pre>
<ul>
<li><code>INNER JOIN</code>：只返回匹配的行</li>
<li><code>LEFT JOIN</code>：返回左表所有行 + 匹配的右表行</li>
<li><code>RIGHT JOIN</code>：返回右表所有行 + 匹配的左表行</li>
</ul>`,
      initialCode: '-- 查询所有部门及其员工数量\nSELECT d.dept_name, COUNT(e.id) as emp_count\nFROM departments d\n',
      sampleData: [
        { dept_name: '技术部', emp_count: 3 },
        { dept_name: '市场部', emp_count: 1 },
        { dept_name: '财务部', emp_count: 0 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /left\s+join\s+employees\s+e\s+on\s+d\.id\s*=\s*e\.dept_id/.test(normalized) &&
               /group\s+by/.test(normalized);
      },
      successMsg: 'LEFT JOIN 确保不遗漏任何数据，这在实际业务中非常常用！'
    },
    // ============ 专家级 - 子查询与窗口函数 ============
    {
      id: 'sql-10',
      title: '子查询',
      difficulty: 'expert',
      xp: 150,
      instruction: `<h4>🎯 任务</h4>
<p>查询薪资<strong>高于</strong>全公司平均薪资的员工姓名和薪资。</p>
<p>表：<code>employees (id, name, department, salary)</code></p>`,
      hint: '在 WHERE 中使用子查询：WHERE salary > (SELECT AVG(salary) FROM employees)',
      theory: `<h4>子查询（Subquery）</h4>
<p>子查询是嵌套在另一个查询中的 SELECT 语句：</p>
<pre>SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);</pre>
<p>子查询可以出现在：</p>
<ul>
<li><code>WHERE</code> 条件中</li>
<li><code>FROM</code> 子句中（派生表）</li>
<li><code>SELECT</code> 列表中（标量子查询）</li>
</ul>`,
      initialCode: '-- 查询高于平均薪资的员工\n',
      sampleData: [
        { name: '王五', salary: 18000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /select\s+name\s*,\s*salary\s+from\s+employees\s+where\s+salary\s*>\s*\(.*select\s+avg\s*\(\s*salary\s*\)\s+from\s+employees\s*\)/.test(normalized);
      },
      successMsg: '子查询让你可以用一个查询的结果来驱动另一个查询！'
    },
    {
      id: 'sql-11',
      title: '窗口函数 ROW_NUMBER',
      difficulty: 'expert',
      xp: 180,
      instruction: `<h4>🎯 任务</h4>
<p>为每个部门的员工按薪资<strong>从高到低</strong>编号（行号）。</p>
<p>显示：name, department, salary, row_num</p>
<p>表：<code>employees (id, name, department, salary)</code></p>`,
      hint: '使用 ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)',
      theory: `<h4>窗口函数</h4>
<p>窗口函数对一组相关行执行计算，同时保留每一行：</p>
<pre>SELECT name, department, salary,
  ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) as row_num
FROM employees;</pre>
<ul>
<li><code>PARTITION BY</code>：分组窗口</li>
<li><code>ORDER BY</code>：窗口内排序</li>
<li>常见的窗口函数：<code>ROW_NUMBER()</code>, <code>RANK()</code>, <code>DENSE_RANK()</code>, <code>LAG()</code>, <code>LEAD()</code></li>
</ul>`,
      initialCode: '-- 为每个部门员工按薪资编号\n',
      sampleData: [
        { name: '王五', department: '技术部', salary: 18000, row_num: 1 },
        { name: '张三', department: '技术部', salary: 15000, row_num: 2 },
        { name: '赵六', department: '技术部', salary: 13000, row_num: 3 },
        { name: '李四', department: '市场部', salary: 12000, row_num: 1 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /row_number\s*\(\s*\)\s+over\s*\(\s*partition\s+by\s+department\s+order\s+by\s+salary\s+desc\s*\)/.test(normalized);
      },
      successMsg: '窗口函数是 SQL 高级分析的利器，掌握它你就是 SQL 高手了！'
    },
    {
      id: 'sql-12',
      title: 'CTE 公共表表达式',
      difficulty: 'expert',
      xp: 200,
      instruction: `<h4>🎯 任务</h4>
<p>使用 <code>WITH</code> CTE 查询每个部门薪资最高的员工姓名和薪资。</p>
<p>表：<code>employees (id, name, department, salary)</code></p>`,
      hint: 'WITH cte AS (SELECT ..., ROW_NUMBER() OVER(...) as rn FROM employees) SELECT ... FROM cte WHERE rn = 1',
      theory: `<h4>CTE (Common Table Expression)</h4>
<p>CTE 用 <code>WITH</code> 定义临时结果集，让复杂查询更清晰：</p>
<pre>WITH ranked AS (
  SELECT name, department, salary,
    ROW_NUMBER() OVER (
      PARTITION BY department
      ORDER BY salary DESC
    ) as rn
  FROM employees
)
SELECT name, department, salary
FROM ranked
WHERE rn = 1;</pre>
<p>优点：提高可读性，支持递归查询。</p>`,
      initialCode: '-- 使用 CTE 查询每个部门薪资最高的员工\n',
      sampleData: [
        { name: '王五', department: '技术部', salary: 18000 },
        { name: '李四', department: '市场部', salary: 12000 }
      ],
      validator: (code) => {
        const normalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
        return /with\s+\w+\s+as\s*\(/.test(normalized) &&
               /row_number\s*\(\s*\)\s+over/.test(normalized) &&
               /partition\s+by\s+department/.test(normalized) &&
               /where\s+rn\s*=\s*1/.test(normalized);
      },
      successMsg: '恭喜！你已掌握 CTE —— SQL 最强大的可读性工具！SQL 世界探索完成！'
    }
  ]
};