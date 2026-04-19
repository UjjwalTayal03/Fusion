

i wanna study tree questions for my dsa test tommorow start from basic question slowly increase level along with simple java code and explaination wherever needed (P.S - i studied tree but havent practices it in a very very long time)

Perfect. We’ll do progressive practice → basic → medium → slightly tricky, with clean Java + short intuition.

🔰 Level 1: Very Basic (Warm-up)
1. Count number of nodes in a binary tree
💡 Idea:
Every node = 1 + left subtree + right subtree

✅ Code:
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;

        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}
🧠 Remember:
👉 This is the most basic DFS pattern

2. Height of Binary Tree
💡 Idea:
Height = max(left height, right height) + 1

✅ Code:
class Solution {
    public int height(TreeNode root) {
        if (root == null) return 0;

        int left = height(root.left);
        int right = height(root.right);

        return Math.max(left, right) + 1;
    }
}
🧠 Key Insight:
👉 This pattern repeats in MANY problems

3. Inorder Traversal (Left → Root → Right)
💡 Idea:
Classic traversal

✅ Code:
class Solution {
    public void inorder(TreeNode root) {
        if (root == null) return;

        inorder(root.left);
        System.out.print(root.val + " ");
        inorder(root.right);
    }
}
⚡ Level 2: Slightly Better
4. Check if two trees are identical
💡 Idea:
Same structure + same values

✅ Code:
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;

        return (p.val == q.val) &&
               isSameTree(p.left, q.left) &&
               isSameTree(p.right, q.right);
    }
}
5. Mirror (Invert) Binary Tree
💡 Idea:
Swap left and right at every node

✅ Code:
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;

        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        invertTree(root.left);
        invertTree(root.right);

        return root;
    }
}
🔥 Level 3: Important Interview Patterns
6. Diameter of Binary Tree
💡 Idea:
Diameter = longest path between any 2 nodes
👉 Either passes through root OR lies in subtree

⚠️ Trick:
While calculating height, also update diameter

✅ Code:
class Solution {
    int diameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        height(root);
        return diameter;
    }

    private int height(TreeNode root) {
        if (root == null) return 0;

        int left = height(root.left);
        int right = height(root.right);

        diameter = Math.max(diameter, left + right);

        return Math.max(left, right) + 1;
    }
}
🧠 Insight:
👉 “Do extra work while returning height” → VERY IMPORTANT PATTERN

7. Maximum Depth (Same as height but commonly asked)
Already done (Q2) → just naming difference

⚡ Mini Practice (Do yourself now)
Try coding these quickly:

Preorder traversal

Postorder traversal

Count leaf nodes

Sum of all nodes

🚀 Next Step (if you say continue)
We’ll move to:

Balanced Binary Tree ✅

Lowest Common Ancestor (VERY IMPORTANT)

Path Sum problems

BFS (Level Order Traversal)

Hard patterns (views, zigzag, etc.)

If you want test-style practice, say:
👉 “give me test questions”
and I’ll simulate real DSA test (increasing difficulty) 🔥


okay now increase difficulty

Good. Now we move to real interview-level patterns (this is where most students mess up after basics).

I’ll keep it tight + high value.

⚡ Level 4: Core Interview Problems
1. Check if Tree is Balanced
💡 Idea:
For every node →
|left height - right height| <= 1

❌ Naive:
Calling height again and again → O(N²)

✅ Optimized (IMPORTANT PATTERN):
Return height + detect imbalance together

class Solution {
    public boolean isBalanced(TreeNode root) {
        return check(root) != -1;
    }

    private int check(TreeNode root) {
        if (root == null) return 0;

        int left = check(root.left);
        if (left == -1) return -1;

        int right = check(root.right);
        if (right == -1) return -1;

        if (Math.abs(left - right) > 1) return -1;

        return Math.max(left, right) + 1;
    }
}
🧠 Pattern:
👉 “Return -1 to propagate failure upward”

🔥 2. Lowest Common Ancestor (VERY IMPORTANT)
Case: General Binary Tree
💡 Idea:
If node = p or q → return it

If both sides return non-null → this is LCA

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left == null) return right;
        if (right == null) return left;

        return root;
    }
}
🧠 Visualization:
👉 When p is in left and q in right → root becomes answer

⚡ 3. Level Order Traversal (BFS)
💡 Idea:
Use Queue

import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;

        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }

            ans.add(level);
        }

        return ans;
    }
}
🧠 Pattern:
👉 for(size) loop = level separation

🔥 4. Path Sum (Root → Leaf)
💡 Idea:
Keep subtracting target

class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;

        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        return hasPathSum(root.left, targetSum - root.val) ||
               hasPathSum(root.right, targetSum - root.val);
    }
}
⚡ 5. Zigzag Level Order Traversal
💡 Idea:
Alternate direction

import java.util.*;

class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;

        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        boolean leftToRight = true;

        while (!q.isEmpty()) {
            int size = q.size();
            LinkedList<Integer> level = new LinkedList<>();

            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();

                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);

                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }

            ans.add(level);
            leftToRight = !leftToRight;
        }

        return ans;
    }
}
🧠 Most Important Patterns So Far
If you remember only these → you're good:

Height + extra work (Diameter, Balanced)

Return node upward (LCA)

Queue + size loop (BFS)

Path recursion (targetSum - node.val)

🧪 Quick Test (Do mentally)
Why do we use -1 in balanced tree?

In LCA, why return root when both sides are non-null?

In BFS, why do we store size before loop?

🚀 Next Level (say continue)
We’ll go hard / test-level:

Maximum Path Sum (🔥 VERY IMPORTANT)

Boundary Traversal

Vertical Order Traversal

Top View / Bottom View

Binary Tree to DLL

If your test is serious → next level is MUST.


okay next level

Alright — now we enter 🔥 high-value / exam-winning level.
These are the questions that differentiate you from average students.

Focus carefully — patterns repeat A LOT.

🔥 Level 5: Advanced Tree Problems
1. Maximum Path Sum (⭐ VERY IMPORTANT)
💡 Problem:
Find max sum of any path (not necessarily root → leaf)

🧠 Core Idea:
At each node:

Either take left + node + right (full path)

Or return one side only (for parent)

👉 Same pattern as diameter but with sum

✅ Code:
class Solution {
    int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        helper(root);
        return maxSum;
    }

    private int helper(TreeNode root) {
        if (root == null) return 0;

        int left = Math.max(0, helper(root.left));
        int right = Math.max(0, helper(root.right));

        maxSum = Math.max(maxSum, left + right + root.val);

        return root.val + Math.max(left, right);
    }
}
⚠️ VERY IMPORTANT:
👉 Math.max(0, …) → ignore negative paths
👉 Global variable used (same as diameter)

2. Vertical Order Traversal
💡 Idea:
Assign each node a column index

left → col - 1

right → col + 1

✅ Code (basic version):
import java.util.*;

class Solution {
    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;

        Map<Integer, List<Integer>> map = new TreeMap<>();
        Queue<Pair> q = new LinkedList<>();

        q.offer(new Pair(root, 0));

        while (!q.isEmpty()) {
            Pair p = q.poll();

            map.putIfAbsent(p.col, new ArrayList<>());
            map.get(p.col).add(p.node.val);

            if (p.node.left != null)
                q.offer(new Pair(p.node.left, p.col - 1));

            if (p.node.right != null)
                q.offer(new Pair(p.node.right, p.col + 1));
        }

        for (List<Integer> list : map.values()) {
            ans.add(list);
        }

        return ans;
    }

    class Pair {
        TreeNode node;
        int col;

        Pair(TreeNode n, int c) {
            node = n;
            col = c;
        }
    }
}
🧠 Pattern:
👉 BFS + coordinates

3. Top View of Binary Tree
💡 Idea:
First node at each vertical column

✅ Code:
import java.util.*;

class Solution {
    public List<Integer> topView(TreeNode root) {
        List<Integer> ans = new ArrayList<>();
        if (root == null) return ans;

        Map<Integer, Integer> map = new TreeMap<>();
        Queue<Pair> q = new LinkedList<>();

        q.offer(new Pair(root, 0));

        while (!q.isEmpty()) {
            Pair p = q.poll();

            map.putIfAbsent(p.col, p.node.val);

            if (p.node.left != null)
                q.offer(new Pair(p.node.left, p.col - 1));

            if (p.node.right != null)
                q.offer(new Pair(p.node.right, p.col + 1));
        }

        for (int val : map.values()) {
            ans.add(val);
        }

        return ans;
    }

    class Pair {
        TreeNode node;
        int col;

        Pair(TreeNode n, int c) {
            node = n;
            col = c;
        }
    }
}
4. Boundary Traversal
💡 Idea:
3 parts:

Left boundary

Leaf nodes

Right boundary (reverse)

⚠️ Important:
👉 Avoid duplicates

✅ Code (clean version):
import java.util.*;

class Solution {
    public List<Integer> boundary(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;

        if (!isLeaf(root)) res.add(root.val);

        addLeft(root, res);
        addLeaves(root, res);
        addRight(root, res);

        return res;
    }

    private boolean isLeaf(TreeNode node) {
        return node.left == null && node.right == null;
    }

    private void addLeft(TreeNode node, List<Integer> res) {
        node = node.left;
        while (node != null) {
            if (!isLeaf(node)) res.add(node.val);
            node = (node.left != null) ? node.left : node.right;
        }
    }

    private void addLeaves(TreeNode node, List<Integer> res) {
        if (node == null) return;

        if (isLeaf(node)) {
            res.add(node.val);
            return;
        }

        addLeaves(node.left, res);
        addLeaves(node.right, res);
    }

    private void addRight(TreeNode node, List<Integer> res) {
        List<Integer> temp = new ArrayList<>();
        node = node.right;

        while (node != null) {
            if (!isLeaf(node)) temp.add(node.val);
            node = (node.right != null) ? node.right : node.left;
        }

        Collections.reverse(temp);
        res.addAll(temp);
    }
}
🧠 FINAL PATTERN SUMMARY (🔥 revise before test)
If you revise this, you're ahead of 90% students:

1. Height-based problems
Diameter

Balanced

Max Path Sum

👉 “Do extra work while returning height”

2. BFS + Coordinates
Vertical traversal

Top view

Bottom view

3. Path-based recursion
Path sum

Max path sum

4. Special Traversals
Boundary

Zigzag

⚡ FINAL TEST (simulate exam)
Try solving WITHOUT seeing solution:

Max Path Sum

LCA

Level Order

Balanced Tree

Top View

If you want:
👉 I can give you a 1-hour mock test paper (very real placement level)
👉 Or rapid revision cheatsheet before exam 🚀



