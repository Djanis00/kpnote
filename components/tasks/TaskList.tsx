import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskList({ tasks, onSelect }) {
  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          onPress={() => onSelect(task)}
          style={[styles.taskItem, task.completed && styles.completedTask]}
        >
          <Text style={styles.taskText}>{task.description}</Text>

          {task.subtasks?.length > 0 && (
            <View style={styles.subtasks}>
              {task.subtasks.slice(0, 3).map((sub, i) => (
                <Text
                  key={i}
                  style={[
                    styles.subtaskText,
                    sub.completed && { textDecorationLine: 'line-through', color: '#999' },
                  ]}
                >
                  - {sub.description}
                </Text>
              ))}
              {task.subtasks.length > 3 && (
                <Text style={styles.more}>+ {task.subtasks.length - 3} autres</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  taskItem: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  completedTask: {
    backgroundColor: '#e6ffe6',
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtasks: {
    marginTop: 4,
  },
  subtaskText: {
    fontSize: 14,
    color: '#555',
  },
  more: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});
