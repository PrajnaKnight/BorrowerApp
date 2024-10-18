import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import applyFontFamily from '../../../assets/style/applyFontFamily';

export default function FileUpload({ placeholder, showLabel = true }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(placeholder || 'Select a file');

  useEffect(() => {
    setPlaceholderText(placeholder || 'Select a file');
  }, [placeholder]);

  const handleFilePick = () => {
    // Simulating file pick. In a real app, you'd use DocumentPicker here
    setFile({ name: "Report-24-23.pdf" });
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Upload File</Text>}
      <View style={styles.uploadContainer}>
        <View style={[styles.fileInfoContainer, file && styles.fileInfoContainerActive]}>
          {file ? (
            <>
              <Text style={styles.fileName}>{file.name}</Text>
              <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
                <Icon name="times-circle" color="#FF0000" size={16} />
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.placeholder}>
              {placeholderText}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
          <Icon name="upload" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      {file && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = applyFontFamily({
  container: {
    width: '100%',
    maxWidth: 400,
    zIndex: -1,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  fileInfoContainerActive: {
    borderColor: 'transparent',
  },
  fileName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  removeButton: {
    padding: 4,
  },
  uploadButton: {
    backgroundColor: '#F97316',
    borderRadius: 6,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    height: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 8,
    fontSize: 12,
    color: '#6B7280',
  },
});